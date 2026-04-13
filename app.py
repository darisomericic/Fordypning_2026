from flask import Flask, request, jsonify
from flask_cors import CORS 
import mysql.connector
import re 
from flask_mail import Mail, Message


app = Flask(__name__)
CORS(app, origins="http://localhost:5173") # tillater forespørsel fra frontend som kjørerp å localhost:5173 

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="daris123",
    database="Fordypning_Demo",
    autocommit=True
)

app.config['MAIL_SERVER'] = 'smtp.gmail.com' # serveren for å sende en epost 
app.config['MAIL_PORT'] = 587 # port for epost 
app.config['MAIL_USE_TLS'] = True # sikkerhetsprotokoll som beskytter e-posten under overføring
app.config['MAIL_USERNAME'] = 'darisomericicpg@gmail.com'
app.config['MAIL_PASSWORD'] = 'njrk kzgi hanj zcdh' # app-passord nødvendig for å sende epost fra en konto

mail = Mail(app) # putter mail funksjonen i appen 

def gyldig_mail(epost): # definisjon for å sjekke om epost er gyldig med regex
    return re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', epost) # regex som sjekker at eposten er gyldig

@app.route("/bestill", methods=["POST"]) #  
def bestill():
    data = request.json # henter data fra frontend ved hjelp av json 
   
    if not gyldig_mail(data["epost"]): # om eposten er ikke gyldig 
        return jsonify({"feil": "Ugyldig e-postadresse!"}), 400 # får man denne meldingen
 
    cursor = db.cursor() # starter en SQL kommando for å kunne kjøre SQL kommandoer på db
    cursor.execute('INSERT INTO bestilling (navn, epost, tjeneste, Tid, Dato) VALUES (%s, %s, %s, %s, %s)', (data["navn"], data["epost"], data["tjeneste"], data["valgtTid"], data["valgtDato"])) # SQL kommando som lar oss sette det vi vil i db
    db.commit() # lagrer endirngene i db
    
    
    
    msg = Message ( # opretting av melding til kunde
        subject="Bestillingsbekreftelse", # emne 
        sender="darisomericicpg@gmail.com", # avsender
        recipients=[data["epost"]], # mottaker som er eposten som kunde putter inn i skjemaet
    )
    
    msg.body = f"Hei {data['navn']}! Din bestilling på {data['tjeneste']} er mottatt." # Overskrift en kunde får 
    
    # Hele meldingen, med bestillingen
    msg.html = f""" 
    <html>
  <body>
    <h1 style="font-size: 28px; color: #333;">Hei {data['navn']}!</h1>
    <p style="font-size: 18px;">Din bestilling er mottatt:</p>
    <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
    <p style="font-size: 16px;"><strong>Tjeneste:</strong> {data['tjeneste']}</p>
    <p style="font-size: 16px;"><strong>Dato:</strong> {data['valgtDato']}</p>
    <p style="font-size: 16px;"><strong>Tid:</strong> {data['valgtTid']}</p>
    </div>
    <p style="font-size: 16px;">Vi sees snart!</p>
  </body>
</html>  
"""
    mail.send(msg) # epost sendes til kunden 
    return jsonify({"message": "Bestilling mottatt!"})





if __name__ == "__main__":
    app.run(debug=True)











