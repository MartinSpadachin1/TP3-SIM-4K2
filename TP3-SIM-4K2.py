import random
def resultadoPrimerTiro(numeroAleatorio):
    if 0 <= numeroAleatorio <= 39:
        return 3
    elif 40 <= numeroAleatorio <= 64:
        return 2
    elif 65 <= numeroAleatorio <= 84:
        return 1
    elif numeroAleatorio > 84:
        return 0
    
def resultadoSegundoTiro(cantidadMetros, numeroAleatorio):
     if cantidadMetros == 3:
            return 3 if numeroAleatorio < 9 else 9
     elif cantidadMetros == 2:
            return 2 if numeroAleatorio <= 23 else 9 
     elif cantidadMetros == 1:
            return 1 if numeroAleatorio <= 42 else 9 

def determinarPuntaje(resultado):
    if resultado == 0:
        return 50
    elif resultado in [1,2,3]:
        return 25
    else:
        return 0            

def generarNumero():
    return random.uniform(0,1) * 100   

def calcularLaProbabilidad(cantidadIteraciones, AcumVecesSuperado):
     return (AcumVecesSuperado/cantidadIteraciones)*100
def mostrarCampo(vector):
    campos = [
        "0 - Número de tiro",
        "1 - Primer RND (tiro inicial)",
        "2 - Resultado del primer tiro",
        "3 - Segundo RND (si hay segundo tiro)",
        "4 - Resultado del segundo tiro",
        "5 - Puntos obtenidos en el hoyo",
        "6 - Acumulador de puntos en los 10 hoyos",
        "7 - Veces que se superó el objetivo (>125 puntos)",
        "8 - Salir"
    ]

    while True:
        print("\nSeleccione el campo que desea visualizar:")
        for campo in campos:
            print(campo)
        try:
            seleccion = int(input("Ingrese la opción (0-8): "))
            if 0 <= seleccion <= 7:
                print(f"\nValor del campo '{campos[seleccion][4:]}': {vector[seleccion]}\n")
            elif seleccion == 8:
                print("Saliendo del menú.")
                break
            else:
                print("❌ Opción fuera de rango (0-8).")
        except ValueError:
            print("❌ Entrada inválida. Ingrese un número entre 0 y 8.")


def main():
    cont = 0
    ##       0         1        2        3       4          5             6                       7
    ##Numero de tiro, RND , Resultado , RND, Resultado,  Puntos,Acumulador de Puntos,Acumulador de veces superado la condicion
    vector = [0,0,False,0,False,0,0,0]
    
    cantidadIteraciones = int(input("Ingresar la cantidad de iteraciones:")) 
    while cantidadIteraciones == 0:
        print("La cantidad de iteraciones debe ser mayor a 0!!!")
        cantidadIteraciones = int(input("Ingresar la cantidad de iteraciones:")) 
    
    while cont < cantidadIteraciones:
       vector[6] = 0
       for i in range(10):
           vector[0] = i + 1
           vector[1] = generarNumero()
           vector[2] = resultadoPrimerTiro(vector[1])
           vector[3] = 0
           vector[4] = False
           vector[5] = 0 
           if vector[2] == 0:
               vector[5] = determinarPuntaje(vector[2])
           else:
                vector[3] = generarNumero()
                vector[4] = resultadoSegundoTiro(vector[2],vector[3])
                vector[5] = determinarPuntaje(vector[4])
         
           vector[6] = vector[6]+ vector[5]
           
       if vector[6] > 125:
           vector[7] += 1
       cont+= 1
       
    print(f'La Probabilidad de que en 10 hoyos se superen los 125 puntos es de: {calcularLaProbabilidad(cantidadIteraciones,vector[7])}%')
    mostrarCampo(vector)               

               
           
        
if __name__ == "__main__":
    main()