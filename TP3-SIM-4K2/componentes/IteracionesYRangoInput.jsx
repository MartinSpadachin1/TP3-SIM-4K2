import React, { useState, useEffect } from 'react';

const IteracionesYRangoInput = ({ onSubmit }) => {
  const [rondass, setRondass] = useState('');
  const [mostrarRango, setMostrarRango] = useState('no');
  const [rondaInicioMuestra, setRondaInicioMuestra] = useState('');
  const [cantRondasAMostrar, setCantRondasAMostrar] = useState('');
  const [puntajeUnTiro, setPuntajeUnTiro] = useState('50');
  const [puntajeDosTiros, setPuntajeDosTiros] = useState('25');
  const [puntajeAsuperar, setPuntajeAsuperar] = useState('150');
  const [cantidadHoyos, setCantidadHoyos] = useState('10');
  const [error, setError] = useState('');

  useEffect(() => {
  const rondas = parseInt(rondass, 10);
  const desde = parseInt(rondaInicioMuestra, 10);
  const hasta = desde + parseInt(cantRondasAMostrar, 10);
  const pUnTiro = parseInt(puntajeUnTiro, 10);
  const pDosTiros = parseInt(puntajeDosTiros, 10);
  const pSuperar = parseInt(puntajeAsuperar, 10);
  const hoyos = parseInt(cantidadHoyos, 10);
  if (isNaN(rondas) || rondas <= 0) {
    setError('Ingrese una cantidad de rondas válida (> 0).');
    return;
  }

  if ([pUnTiro, pDosTiros, pSuperar,hoyos].some(p => isNaN(p) || p < 0)) {
    setError('Ingrese puntajes válidos (números enteros >= 0).');
    return;
  }

  setError('');
  onSubmit({
    rondas: rondas,
    rango: mostrarRango === 'si' ? { desde, hasta } : null,
    puntajes: {
      unTiro: pUnTiro,
      dosTiros: pDosTiros,
      puntajeAsuperar: pSuperar,
      
    },
    cantidadHoyos: hoyos
  });
}, [
  rondass, rondaInicioMuestra, cantRondasAMostrar,
  mostrarRango, puntajeUnTiro, puntajeDosTiros,
  puntajeAsuperar,cantidadHoyos,  // <— aquí
  onSubmit
]);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className="mb-3">
        <label className="form-label">Cantidad de Rondas:</label>
        <input
          type="number"
          className="form-control"
          value={rondass}
          onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseInt(value, 10) >= 1) {
                          setRondass(value);
                          setError('');
                        } else {
                          setError('No se permiten valores negativos ni cero.');
                        }
                      }}
          placeholder="Ej: 1000"
          min={1}
        />
      </div>
            <div className="mb-3">
        <label className="form-label">Cantidad de hoyos por ronda:</label>
        <input
          type="number"
          className="form-control"
          value={cantidadHoyos}
          onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseInt(value, 10) >= 1) {
                          setCantidadHoyos(value);
                          setError('');
                        } else {
                          setError('No se permiten valores negativos ni cero.');
                        }
                      }}
          placeholder="Ej: 10"
          min={1}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">¿Desea mostrar rondas?</label>
        <select
          className="form-select"
          value={mostrarRango}
          onChange={(e) => setMostrarRango(e.target.value)}
        >
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      </div>

      {mostrarRango === 'si' && (
        <>
          <div className="mb-3">
            <label className="form-label">Cantidad de Rondas a mostrar:</label>
            <input
              type="number"
              className="form-control"
              value={cantRondasAMostrar}
              onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || parseInt(value, 10) >= 1) {
                              setCantRondasAMostrar(value);
                              setError('');
                            } else {
                              setError('No se permiten valores negativos ni cero.');
                            }
                          }}
              placeholder="Ej: 10"
              min={1}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mostrar desde la Ronda número:</label>
            <input
              type="number"
              className="form-control"
              value={rondaInicioMuestra}
              onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || parseInt(value, 10) >= 1) {
                              setRondaInicioMuestra(value);
                              setError('');
                            } else {
                              setError('No se permiten valores negativos ni cero.');
                            }
                          }}
              placeholder="Ej: 20"
              min={1}
            />
          </div>
        </>
      )}

      <hr />

      <h5>Puntajes por tipo de tiro:</h5>
      <div className="mb-3">
        <label className="form-label">Puntaje si emboca de 1 tiro:</label>
        <input
          type="number"
          className="form-control"
          value={puntajeUnTiro}
          onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseInt(value, 10) >= 0) {
                          setPuntajeUnTiro(value);
                          setError('');
                        } else {
                          setError('No se permiten valores negativos.');
                        }
                      }}
          min="0"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Puntaje si emboca de 2 tiros:</label>
        <input
          type="number"
          className="form-control"
          value={puntajeDosTiros}
          onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseInt(value, 10) >= 0) {
                          setPuntajeDosTiros(value);
                          setError('');
                        } else {
                          setError('No se permiten valores negativos.');
                        }
                      }}
          min="0"
        />
      </div>
            <div className="mb-3">
        <label className="form-label">Puntaje a superar por ronda:</label>
        <input
          type="number"
          className="form-control"
          value={puntajeAsuperar}
          onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || parseInt(value, 10) >= 0) {
                          setPuntajeAsuperar(value);
                          setError('');
                        } else {
                          setError('No se permiten valores negativos.');
                        }
                      }}
          min="0"
        />
      </div>

      {error && <div className="text-danger mb-2">{error}</div>}
    </div>
  );
};

export default IteracionesYRangoInput;
