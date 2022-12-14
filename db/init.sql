CREATE DATABASE maintenance_tasks;

USE maintenance_tasks;

CREATE TABLE users(
id int NOT NULL AUTO_INCREMENT,
email varchar(255) NOT NULL,
password varchar(255) NOT NULL,
name varchar(255) NOT NULL,
role ENUM('manager', 'technician') NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE tasks (
id int NOT NULL AUTO_INCREMENT,
user_id int NOT NULL,
name varchar(255) NOT NULL,
summary varchar(2500) NOT NULL,
perfomed_task_date DATE NULL,
created_at DATETIME NOT NULL,
updated_at DATETIME NULL,
PRIMARY KEY (id),
FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE USER 'sword'@'%' IDENTIFIED BY 'sword';
GRANT CREATE ON * . * TO 'sword'@'%';
GRANT DELETE ON * . * TO 'sword'@'%';
GRANT INSERT ON * . * TO 'sword'@'%';
GRANT SELECT ON * . * TO 'sword'@'%';
GRANT UPDATE ON * . * TO 'sword'@'%';
FLUSH PRIVILEGES;