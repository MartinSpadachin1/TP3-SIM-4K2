from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app) 
def resultadoPrimerTiro(numeroAleatorio, intervalos):
    if 0 <= numeroAleatorio <= intervalos['tres']-1:
        return 3
    elif numeroAleatorio <= intervalos['tres'] + intervalos['dos'] - 1:
        return 2
    elif numeroAleatorio <= intervalos['tres'] + intervalos['dos'] + intervalos['uno'] - 1:
        return 1
    return 0

def resultadoSegundoTiro(cantidadMetros, numeroAleatorio, rango):
   
    if cantidadMetros == 3:
        return 3 if numeroAleatorio <= int(rango[0]['resultados'][0]['valor'])-1 else 9
    elif cantidadMetros == 2:
        return 2 if numeroAleatorio <= int(rango[1]['resultados'][0]['valor'])-1 else 9 
    elif cantidadMetros == 1:
        return 1 if numeroAleatorio <= int(rango[2]['resultados'][0]['valor'])- 1 else 9 

def determinarPuntaje(resultado, puntajes):
    if resultado == 0:
        return puntajes['unTiro']
    elif resultado in [1, 2, 3]:
        return puntajes['dosTiros']
    return 0

def generarNumero():
    return random.uniform(0, 1) * 100

@app.route('/simular', methods=['POST'])
def simular():
    data = request.get_json()

    iteraciones = data['iteracionesYRango']['iteraciones']
    rangoPrimerTiro = data['probabilidades']  # puede ser None
    rangoSegundoTiro = data['datosSegundaBola']
    puntajes = data['iteracionesYRango']['puntajes']  # {'unTiro': int, 'dosTiros': int}
    rango = data['iteracionesYRango']['rango'] 
    hoyos = int(data['iteracionesYRango']['cantidadHoyos'])
    # Intervalos configurables (puedes hacerlos dinámicos también si querés)
    intervalos = {
        'tres': int(rangoPrimerTiro[0]['valor']),
        'dos': int(rangoPrimerTiro[1]['valor']),
        'uno': int(rangoPrimerTiro[2]['valor'])
    }
    
    resultados = []
   
    vector = [0, 0, False, 0, False, 0, 0, 0,0]
    for iter in range(int(iteraciones)):
        vector[6] = 0  # acumulador de puntos
        flag = False
        for i in range(hoyos):
            vector[0] = i + 1
            vector[1] = generarNumero()
            vector[2] = resultadoPrimerTiro(vector[1], intervalos)
            vector[3] = 0
            vector[4] = False
            vector[5] = 0
            vector[8] += 1
            if vector[2] == 0:
                vector[5] = determinarPuntaje(vector[2], puntajes)
            else:
                vector[3] = generarNumero()
                vector[4] = resultadoSegundoTiro(vector[2], vector[3], rangoSegundoTiro)
                vector[5] = determinarPuntaje(vector[4], puntajes)

            vector[6] += vector[5]
                
            if (
                rango is not None and 
                rango.get('desde') is not None and 
                rango.get('hasta') is not None and 
                int(rango['desde']) <= vector[8] <= int(rango['hasta'])
            ):
                resultados.append(vector.copy())

         
            if vector[6] > int(puntajes['puntajeAsuperar']) and flag is not True :
                    flag = True
                    vector[7] += 1

    probabilidad = (vector[7] / iteraciones) * 100

    return jsonify({
        'probabilidad': probabilidad,
        'vectores': resultados
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
