<!DOCTYPE html>
<html>
<head>
    <title>Image App</title>
</head>
<body>
    <h1>Welcome to Image App</h1>
    
    <div>
        ${demo.message}
        Features:
        - Upload images securely
        - View all uploaded images in gallery
        - Store images in dedicated uploads directory
        - Support for multiple image formats
    </div>
    
    <div>
        <a href="${pageContext.request.contextPath}/upload">Upload Image</a>
        <a href="${pageContext.request.contextPath}/">View Gallery</a>
    </div>
</body>
</html>