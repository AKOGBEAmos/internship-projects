const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "panaff150@gmail.com",
        pass: "nijvharyhclhdrqz"
    }
})


module.exports = (mailOptions, user, res) => {
    /* Mail Options  = {
        from: 
        to: 
        subject: 
        text: 
    } 
    */

    /* Check mail Options */
    mailOptions.from = "panaff150@gmail.com";
    /* sending the mail */
    transport.sendMail(mailOptions,async (error, info)  => {
        if (error) {
            await user.destroy()
            console.log(error)
        } else {
            console.log("Mail sent: "+info.response)
        }
    })

}
