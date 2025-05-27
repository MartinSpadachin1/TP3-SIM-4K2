import React from 'react';

const ProbabilidadTabla = ({ probabilidades, setProbabilidades }) => {
  const handleChange = (index, newValue) => {
    const nuevaLista = [...probabilidades];
    nuevaLista[index].valor = newValue;
    setProbabilidades(nuevaLista);
  };

  const suma = probabilidades.reduce((acc, curr) => {
    const valNum = Number(curr.valor);
    return acc + (isNaN(valNum) ? 0 : valNum);
  }, 0);

  const error = suma !== 100;

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h2>Probabilidad de Embocar</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Distancia al hoyo</th>
            <th style={{ padding: '8px', border: '1px solid #ccc' }}>Probabilidad (%)</th>
          </tr>
        </thead>
        <tbody>
          {probabilidades.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>{item.rango}</td>
              <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                <input
                  type="number"
                  value={item.valor}
                  min="0"
                  max="100"
                  onChange={(e) => handleChange(index, e.target.value)}
                  style={{ width: '60px', padding: '4px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: '1rem' }}>
        Suma total: <strong>{suma}%</strong>
      </p>
      {error && (
        <p style={{ color: 'red' }}>
          ⚠️ La suma de las probabilidades debe ser exactamente 100%.
        </p>
      )}
    </div>
  );
};

export default ProbabilidadTabla;
