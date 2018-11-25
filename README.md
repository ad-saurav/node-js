# nodejs-express-mysql-crud
Node JS Tutorial

## MySQL
```mysql
create table user (
id int(10) not null, 
userid varchar(16) not null, 
first_name varchar(16), 
last_name varchar(32),
password varchar(256) NOT NULL,
created datetime NOT NULL,
modified datetime NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE user ADD PRIMARY KEY (id);
ALTER TABLE user MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3; COMMIT;
```

## Command
```node
npm install

set DEBUG=nodejs-express-mysql-crud:* & npm start
```

## nodejs-express-mysql-crud.env
```
NODE_ENV=development

MYSQL_DB_HOST=<host name>
MYSQL_DB_PORT=<mysql port>
MYSQL_DB_SCHEMA=<schema name>
MYSQL_DB_USER=<node user>
MYSQL_DB_PASS=<node pass>

JWT_ENCRYPTION=mju7XW@mju7DE#mju7FR$mju7BGT%mju7NHY^mju7JU&mju7<KI*
JWT_EXPIRATION=10m
```
