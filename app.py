from flask import Flask, request, jsonify
from flask_cors import CORS 
import mysql.connector
import re 
from flask_mail import Mail, Message


app = Flask(__name__)
CORS(app, origins="http://localhost:5173") # tillater forespørsel fra frontend som kjørerp å localhost:5173 

db = mysql.connector.connect(
    host=" 172.23.208.1",
    user="root",
    password="daris123",
    database="Fordypning_Demo",
    autocommit=True
)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'darisomericicpg@gmail.com'
app.config['MAIL_PASSWORD'] = 'njrk kzgi hanj zcdh'

mail = Mail(app)

def gyldig_mail(epost):
    return re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', epost)

@app.route("/bestill", methods=["POST"])
def bestill():
    data = request.json 
   
    if not gyldig_mail(data["epost"]):
        return jsonify({"feil": "Ugyldig e-postadresse!"}), 400

    cursor = db.cursor()
    cursor.execute('INSERT INTO bestilling (navn, epost, tjeneste) VALUES (%s, %s, %s)', (data["navn"], data["epost"], data["tjeneste"]))
    db.commit()
    
    msg = Message (
        subject="Bestillingsbekreftelse",
        sender="darisomericicpg@gmail.com",
        recipients=[data["epost"]],
    )
    
    msg.body = f"""
    Hei {data["navn"]}! 
     
    
    Din bestilling er mottatt: 
    Tjeneste: {data["tjeneste"]}
    
    Vi sees snart!
    """
    mail.send(msg)
    return jsonify({"message": "Bestilling mottatt!"})





if __name__ == "__main__":
    app.run(debug=True)











