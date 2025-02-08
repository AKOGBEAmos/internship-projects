<!DOCTYPE html>
<html>
<head>
    <title>Image App</title>
</head>
<body>
    <h1>Image Library</h1>
    <ul>
        <li><a href="${pageContext.request.contextPath}/upload">Upload the new image</a></li>
    </ul>
    <div>
        <ul>
            <!-- Parcourt la liste des images -->
            <li th:each="image : ${images}">
                <img th:src="${image}" alt="Image" style="max-width:200px; max-height:200px;"/>
            </li>
        </ul>
    </div>
</body>
</html>
