create table Bestilling (
    id INT AUTO_INCREMENT PRIMARY KEY,
    navn VARCHAR(100),
    epost VARCHAR(100),
    tjeneste VARCHAR(50),
    opprettet TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);