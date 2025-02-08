<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Image App| javaguides.net</title>
<body>
   <h1>Welcome to Image App</h1>
   
   <div th:text="${demo.message}">
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
