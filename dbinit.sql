DROP DATABASE IF EXISTS seoul_culture;
CREATE DATABASE IF NOT EXISTS seoul_culture DEFAULT CHARACTER SET utf8;

USE seoul_culture;

DROP TABLE IF EXISTS cul_pos;
CREATE TABLE cul_pos(
    IDX INT(10) NOT NULL AUTO_INCREMENT,
    CODE VARCHAR(255) NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    ADDRESS VARCHAR(255) NOT NULL,
    HOMEURL VARCHAR(255) NOT NULL,
    LOC_LOG VARCHAR(255) NOT NULL,
    LOC_LAT VARCHAR(255) NOT NULL,
    CONTACT VARCHAR(255) NOT NULL,
    MAIN_IMG VARCHAR(255) NOT NULL,
    PRIMARY KEY(IDX)
);

create unique index adress_index on cul_pos(ADDRESS);
create unique index urlindex on cul_pos (HOMEURL);
create unique index log_index on cul_pos (LOC_LOG);
create unique index lat_index on cul_pos (LOC_LAT);
create unique index call_index on cul_pos (CONTACT);
create unique index img_index on cul_pos (MAIN_IMG);

DROP TABLE IF EXISTS cul_event;
CREATE TABLE cul_event(
    IDX INT(4) NOT NULL AUTO_INCREMENT,
    CODE VARCHAR(255) NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    HOMEURL VARCHAR(255) NOT NULL,
    DATE VARCHAR(255) NOT NULL,
    PLACE VARCHAR(255) NOT NULL,
    USE_WHO VARCHAR(255) NOT NULL,
    MAIN_IMG VARCHAR(255) NOT NULL,
    PRIMARY KEY(IDX)
);

create unique index img_index on cul_event (MAIN_IMG);

DELETE from cul_event where DATE like '%~2022-10%';
