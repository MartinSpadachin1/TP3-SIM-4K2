import React, { useState, useEffect } from 'react';

const IteracionesYRangoInput = ({ onSubmit }) => {
  const [iteraciones, setIteraciones] = useState('');
  const [mostrarRango, setMostrarRango] = useState('no');
  const [rangoInicio, setRangoInicio] = useState('');
  const [rangoFin, setRangoFin] = useState('');
  const [puntajeUnTiro, setPuntajeUnTiro] = useState('50');
  const [puntajeDosTiros, setPuntajeDosTiros] = useState('25');
  const [error, setError] = useState('');

  useEffect(() => {
    const iter = parseInt(iteraciones, 10);
    const desde = parseInt(rangoInicio, 10);
    const hasta = parseInt(rangoFin, 10);
    const pUnTiro = parseInt(puntajeUnTiro, 10);
    const pDosTiros = parseInt(puntajeDosTiros, 10);

    if (isNaN(iter) || iter <= 0) {
      setError('Ingrese una cantidad de iteraciones válida (> 0).');
      return;
    }

    if (
      [pUnTiro, pDosTiros].some(p => isNaN(p) || p < 0)
    ) {
      setError('Ingrese puntajes válidos (números enteros >= 0).');
      return;
    }

    if (mostrarRango === 'si') {
      if (
        isNaN(desde) || isNaN(hasta) ||
        desde < 0 || hasta < 0 ||
        desde > hasta || hasta > iter * 10
      ) {
        setError('Ingrese un rango válido (0 <= desde <= hasta < iteraciones).');
        return;
      }
    }

    setError('');
    onSubmit({
      iteraciones: iter,
      rango: mostrarRango === 'si' ? { desde, hasta } : null,
      puntajes: {
        unTiro: pUnTiro,
        dosTiros: pDosTiros,
      },
    });

  }, [iteraciones, rangoInicio, rangoFin, mostrarRango, puntajeUnTiro, puntajeDosTiros, onSubmit]);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className="mb-3">
        <label className="form-label">Cantidad de iteraciones:</label>
        <input
          type="number"
          className="form-control"
          value={iteraciones}
          onChange={(e) => setIteraciones(e.target.value)}
          placeholder="Ej: 1000"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">¿Desea mostrar un rango de vectores?</label>
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
            <label className="form-label">Desde:</label>
            <input
              type="number"
              className="form-control"
              value={rangoInicio}
              onChange={(e) => setRangoInicio(e.target.value)}
              placeholder="Ej: 10"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Hasta:</label>
            <input
              type="number"
              className="form-control"
              value={rangoFin}
              onChange={(e) => setRangoFin(e.target.value)}
              placeholder="Ej: 20"
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
          onChange={(e) => setPuntajeUnTiro(e.target.value)}
          min="0"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Puntaje si emboca de 2 tiros:</label>
        <input
          type="number"
          className="form-control"
          value={puntajeDosTiros}
          onChange={(e) => setPuntajeDosTiros(e.target.value)}
          min="0"
        />
      </div>

      {error && <div className="text-danger mb-2">{error}</div>}
    </div>
  );
};

export default IteracionesYRangoInput;
