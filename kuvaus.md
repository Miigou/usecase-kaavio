Äänestys
Käyttäjät ovat admin, joka voi tehdä ja poistaa äänestyksiä, sekä tavallinen käyttäjä joka voi äänestää äänestyksissä.
Laukaisijoja ovat esimerkiksi kun tavallinen käyttäjä klikkaa äänestä nappia, tai kun admin luo tai poistaa äänestyksiä. 
Esiehtoja ovat että käyttäjä tai admin on kirjautunut sisään, jotta he voivat äänestää/luoda ja poistaa äänestyksiä. Myös äänestyksen olemassa olo on esiehto jotta käyttäjällä on jotain mitä äänestää
Jälkiehtoja ovat että ääni on kirjattu järjestelmään kunhan käyttäjä on äänestänyt. Jälkiehtoja on myös että äänestykset jotka admin luo näkyvät järjestelmässä, ja äänestykset jotka admin poistaa poistuvat järjestelmästä.
Normaali käyttötapauksen kulku tavallisella käyttäjällä on: Käyttäjä kirjautuu sisään - valitsee jonkun aktiivisista äänestyksistä - valitsee yhden äänestyksen vaihtoehdoista - vahvistaa äänestyksen - järjestelmä tallentaa äänen - äänestys päivittyy
Adminin normaali käyttötapauksen kulku olisi: Admin kirjautuu sisään - admin luo äänestyksen - luotu äänestys näkyy järjestelmässä, vaihtoehtoisesti - admin poistaa äänestyksen - poistettu äänestys poistuu järjestelmästä
Poikkeuksellinen toiminta on esimerkiksi jos käyttäjä yrittää äänestää ilman kirjautumista, äänestys ei poistu vaikka admin poisti sen tai äänestys ei päivity vaikka käyttäjä onnistuneesti äänesti.