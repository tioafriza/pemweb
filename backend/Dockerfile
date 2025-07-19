FROM php:8.1-apache

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite
RUN a2enmod headers

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Create Apache virtual host configuration
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    </VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Allow CORS for all responses (including static and error)
RUN echo 'Header always set Access-Control-Allow-Origin "*"\nHeader always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\nHeader always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"\nHeader always set Access-Control-Max-Age "3600"' > /etc/apache2/conf-available/cors.conf \
    && a2enconf cors

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Ensure .htaccess is readable
RUN chmod 644 /var/www/html/.htaccess

# Create logs directory
RUN mkdir -p /var/log/apache2
RUN chown -R www-data:www-data /var/log/apache2

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
