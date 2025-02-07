<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boutique de Basket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        header {
            background-color: #333;
            color: white;
            padding: 10px 0;
            text-align: center;
        }
        .container {
            margin: 20px auto;
            width: 80%;
            text-align: center;
        }
        .product {
            display: inline-block;
            margin: 10px;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 200px;
        }
        .product img {
            width: 100%;
            height: auto;
        }
        .product h3 {
            font-size: 18px;
            color: #333;
        }
        .product p {
            color: #666;
            font-size: 14px;
        }
        .buy-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff5722;
            color: white;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
        }
        .buy-button:hover {
            background-color: #e64a19;
        }
    </style>
</head>
<body>

<header>
    <h1>Bienvenue sur la boutique de Basket</h1>
    <p>Découvrez nos équipements de qualité pour améliorer vos performances !</p>
</header>

<div class="container">
    <div class="product">
        <img src="https://via.placeholder.com/150" alt="Chaussures de basket">
        <h3>Chaussures de Basket</h3>
        <p>Confortables et performantes, idéales pour les pros comme pour les amateurs.</p>
        <a href="#" class="buy-button">Acheter</a>
    </div>
    <div class="product">
        <img src="https://via.placeholder.com/150" alt="Ballon de basket">
        <h3>Ballon de Basket</h3>
        <p>Ballon de haute qualité, parfait pour les terrains intérieurs et extérieurs.</p>
        <a href="#" class="buy-button">Acheter</a>
    </div>
    <div class="product">
        <img src="https://via.placeholder.com/150" alt="Maillot de Basket">
        <h3>Maillot de Basket</h3>
        <p>Respirant et stylé, le choix idéal pour votre prochaine partie.</p>
        <a href="#" class="buy-button">Acheter</a>
    </div>
</div>

</body>
</html>
