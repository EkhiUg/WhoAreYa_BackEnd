# Who Are Ya? - Backend

## Arkitektura eta Diseinua (Milestone 0)

Proiektu honetarako **arkitektura modularra** eta **server.js** sarrera-puntu bakarra aukeratu dugu. Jarraian, erabaki hauen justifikazioa:

### 1. Proiektuaren Egitura: B Aukera (Modularra)
`src/` karpeta nagusiaren barruan antolatu dugu kodea, arduren banaketa argia (Separation of Concerns) jarraituz:
* **models/**: Datu-basearen eskemak (Mongoose).
* **controllers/**: Eskaeren logika.
* **routes/**: APIaren endpoint definizioak.
* **config/**: Konfigurazio aldagarriak.
Egitura hau Express Generator tradizionala baino garbiagoa eta eskalagarriagoa da, eta Node.js garapen modernoaren estandarrekin bat dator.

### 2. Sarrera Puntua: B Aukera (server.js)
Abiarazteko fitxategi bakar bat (`server.js`) erabiltzea erabaki dugu, `bin/www` eta `app.js` banatzea baino sinpleagoa eta argiagoa delako kodea irakurtzerakoan.

### 3. Konfigurazioa: B Aukera (Zentralizatua)
Ingurune-aldagaiak (`.env`) kudeatzeko, konfigurazio fitxategi zentralizatu bat sortu dugu (`src/config/index.js`). [cite_start]Honek aldagai guztiak leku bakar batean baliozkotzea eta lehenetsitako balioak esleitzea ahalbidetzen du, kodean zehar `process.env` sakabanatuta izatea saihestuz.