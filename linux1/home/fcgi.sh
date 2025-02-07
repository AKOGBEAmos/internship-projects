#!/bin/bash
a2enmod ssl
a2enmod proxy_fcgi setenvif
a2dismod php8.2
a2dismod mpm_prefork
a2enmod mpm_event
a2enconf php8.2-fpm
service apache2 start
service php8.2-fpm start
service apache2 status
