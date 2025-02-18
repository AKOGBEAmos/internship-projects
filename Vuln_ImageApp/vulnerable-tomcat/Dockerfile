FROM tomcat:9.0.60-jre11-openjdk-slim-buster

# Update package lists before installing
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    software-properties-common \
    net-tools \
    iputils-ping \
    iproute2 \
    tzdata && \
    # Clean up apt cache to reduce image size
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add war file to webapps directory
ADD imageApp.war /usr/local/tomcat/webapps/

# Expose default Tomcat port
EXPOSE 8080

CMD ["catalina.sh", "run"]
