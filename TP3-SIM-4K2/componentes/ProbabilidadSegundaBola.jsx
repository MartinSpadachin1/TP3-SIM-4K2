import React from 'react';

const ProbabilidadSegundaBola = ({ datos, setDatos }) => {

  const handleChange = (grupoIndex, resultadoIndex, newValue) => {
    const nuevosDatos = [...datos];
    nuevosDatos[grupoIndex].resultados[resultadoIndex].valor = newValue;
    setDatos(nuevosDatos);
  };

  const validarSuma = (grupo) => {
    const suma = grupo.resultados.reduce((acc, curr) => {
      const valNum = Number(curr.valor);
      return acc + (isNaN(valNum) ? 0 : valNum);
    }, 0);
    return suma === 100;
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h2>Probabilidad Segunda Bola</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Distancia previa</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Resultado</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Probabilidad (%)</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((grupo, grupoIndex) => (
            <React.Fragment key={grupoIndex}>
              {grupo.resultados.map((res, resIndex) => (
                <tr key={resIndex}>
                  {resIndex === 0 ? (
                    <td
                      rowSpan={grupo.resultados.length}
                      style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        verticalAlign: 'middle',
                        backgroundColor: '#fafafa',
                        fontWeight: 'bold',
                      }}
                    >
                      {grupo.distancia}
                    </td>
                  ) : null}
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{res.tipo}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={res.valor}
                      onChange={(e) => handleChange(grupoIndex, resIndex, e.target.value)}
                      style={{ width: '60px', padding: '4px' }}
                    />
                  </td>
                </tr>
              ))}
              {!validarSuma(grupo) && (
                <tr>
                  <td colSpan={3} style={{ color: 'red', textAlign: 'center', padding: '6px' }}>
                    ⚠️ La suma de probabilidades para "{grupo.distancia}" debe ser 100%.
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProbabilidadSegundaBola;
