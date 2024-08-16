const utils = require('../helpers/utils');
const { Op } = require("sequelize");



module.exports = {
    isAuth: async (req, res, next) => {
        const authHeader = req.header('Authorization')
        console.log(authHeader);
        if (!authHeader) {
            return res.status(401).json({error: 'Authorized Access denied: No header'})
        }
        const expired = await utils.expired(authHeader);
        if (expired || expired==null) {
            return res.status(401).json({error: 'Authorized Access denied: Header expired'}) 
        }
        try {
            const decodeJwt = utils.verifyToken(authHeader);
            if (!decodeJwt) return res.status(401).json({error: 'Authorized Access denied: Header not decoded'}) 
            console.log(decodeJwt, authHeader);
            const isAuth = await User.findOne({
                where: {
                    [Op.and]: [
                        {id: decodeJwt.user._id},
                        { disabled: false }
                    ]
                },
                include: [
                    {
                        model: ValidToken,
                        as: 'usersTokens',
                        where: {
                            token: authHeader
                        }
                    }
                ]
            });
            
            if(!isAuth) return res.status(401).json({error: 'Authorized Access denied: User not found for That token'})
            req.userId = decodeJwt.user._id;
            next() 
        } catch (error) {
            return res.status(401).json({error: 'Authorized Access denied: Server error'})
        }
    }

}