from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app) 

# Funciones para determinar el resultado de los tiros y puntajes
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
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()
    #Ejemplo de datos esperados:
    #{
    # 'probabilidades': [   {'rango': 'Más de 3', 'valor': '40'}, 
    #                       {'rango': 'Entre 3 y 1', 'valor': '25'}, 
    #                       {'rango': 'Entre 1 y casi 0', 'valor': '20'}, 
    #                       {'rango': '0 (emboca)', 'valor': '15'}  ],    
    # 'datosSegundaBola': [ {'distancia': 'Más de 3', 
    #                       'resultados': [{'tipo': 'Emboca', 'valor': '10'}, 
    #                                       {'tipo': 'Falla', 'valor': '90'}]}, 
    #                       {'distancia': 'Entre 3 y 1', 
    #                        'resultados': [{'tipo': 'Emboca', 'valor': '24'}, 
    #                                       {'tipo': 'Falla', 'valor': '76'}]}, 
    #                       {'distancia': 'Entre 1 y casi 0', 'resultados': [{'tipo': 'Emboca', 'valor': '43'}, 
    #                                                                         {'tipo': 'Falla', 'valor': '57'}]}], 
    # 'iteracionesYRango': {'rondas': 15, 
    #                       'rango': {'desde': 0, 'hasta': 10}, 
    #                       'puntajes': {'unTiro': 50, 'dosTiros': 25, 'puntajeAsuperar': 150}, 
    #                       'cantidadHoyos': 10}}
    
    rondas = data['iteracionesYRango']['rondas']
    rangoPrimerTiro = data['probabilidades']  # puede ser None
    rangoSegundoTiro = data['datosSegundaBola']
    puntajes = data['iteracionesYRango']['puntajes']  # {'unTiro': int, 'dosTiros': int}
    rango = data['iteracionesYRango']['rango'] 
    hoyos = int(data['iteracionesYRango']['cantidadHoyos'])
    # Intervalos para el primer tiro
    intervalos = {
        'tres': int(rangoPrimerTiro[0]['valor']),
        'dos': int(rangoPrimerTiro[1]['valor']),
        'uno': int(rangoPrimerTiro[2]['valor'])
    }
    
    resultados = []
    # Inicializamos el vector de resultados
    vector = [0,0, 0, False, 0, False, 0, 0, 0] # [ronda, hoyo, primerTiro, resultadoPrimerTiro, segundoTiro, resultadoSegundoTiro, puntajeSegundoTiro, puntosAcumulados, rondasExitosas]
    
    # For para iterar las rondas
    for rond in range(int(rondas)):
        vector[0] = rond + 1 #Contador de ronda
        vector[7] = 0  # acumulador de puntos
        flag = False
        # For para iterar los hoyos
        for hoyo in range(hoyos):
            vector[1] = hoyo + 1 #Contador de hoyo
            vector[2] = generarNumero() #RND primer tiro
            vector[3] = resultadoPrimerTiro(vector[2], intervalos) # Resultado primer tiro
            vector[4] = 0 # RND segundo tiro
            vector[5] = False # Resultado segundo tiro
            vector[6] = 0 # Puntaje segundo tiro
            if vector[3] == 0: # Si el primer tiro es 0, no se lanza el segundo tiro
                vector[6] = determinarPuntaje(vector[3], puntajes)
            else: # Si el primer tiro es 1, 2 o 3, se lanza el segundo tiro
                vector[4] = generarNumero()
                vector[5] = resultadoSegundoTiro(vector[3], vector[4], rangoSegundoTiro)
                vector[6] = determinarPuntaje(vector[5], puntajes)

            vector[7] += vector[6] # Acumulador de puntos

            #Si tenemos que mostrar vectores dentro de un rango validamos y tambien mostramos el ultimo vector   
            if (
                rango is not None and 
                rango.get('desde') is not None and 
                rango.get('hasta') is not None and 
                int(rango['desde']) <= vector[0] <= int(rango['hasta']) or  ## Condicion para mostrar los vectores dentro del rango
                (vector[0] == rondas and vector[1] == hoyos) ## condicion para mostrar el ultimo vector
            ):
                resultados.append(vector.copy())

            # Si el puntaje acumulado supera el puntaje a superar, se marca la bandera y se suma 1 al contador de rondas exitosas
            if vector[7] > int(puntajes['puntajeAsuperar']) and flag is not True : 
                    flag = True
                    vector[8] += 1
    # Al finalizar la simulación, calculamos la probabilidad de éxito con el ultimo vector
    probabilidad = (vector[8] / vector[0]) * 100

    return jsonify({
        'probabilidad': probabilidad,
        'vectores': resultados
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
