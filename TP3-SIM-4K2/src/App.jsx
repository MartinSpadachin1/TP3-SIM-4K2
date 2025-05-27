import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  Table,
} from "react-bootstrap";
import ProbabilidadTabla from "../componentes/TablaProb";
import ProbabilidadSegundaBola from "../componentes/ProbabilidadSegundaBola";
import NavbarGolf from "../componentes/Navbar";
import IteracionesYRangoInput from "../componentes/IteracionesYRangoInput";
import axios from "axios";

function App() {
  // Estados para datos de tablas (para validar y enviar)
  const [probabilidades, setProbabilidades] = useState([
    { rango: "Más de 3", valor: "40" },
    { rango: "Entre 3 y 1", valor: "25" },
    { rango: "Entre 1 y casi 0", valor: "20" },
    { rango: "0 (emboca)", valor: "15" },
  ]);
  const [datosSegundaBola, setDatosSegundaBola] = useState([
    {
      distancia: "Más de 3",
      resultados: [
        { tipo: "Emboca", valor: "10" },
        { tipo: "Falla", valor: "90" },
      ],
    },
    {
      distancia: "Entre 3 y 1",
      resultados: [
        { tipo: "Emboca", valor: "24" },
        { tipo: "Falla", valor: "76" },
      ],
    },
    {
      distancia: "Entre 1 y casi 0",
      resultados: [
        { tipo: "Emboca", valor: "43" },
        { tipo: "Falla", valor: "57" },
      ],
    },
  ]);
  const [iteracionesYRango, setIteracionesYRango] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado para resultados y modal
  const [showModal, setShowModal] = useState(false);
  const [resultados, setResultados] = useState(null);

  // Validaciones
  const validarProbabilidades = () => {
    const sumaSimple = probabilidades.reduce(
      (acc, curr) => acc + Number(curr.valor || 0),
      0
    );
    if (sumaSimple !== 100) {
      setError("La suma de probabilidades en 'Probabilidad de Embocar' debe ser 100%");
      return false;
    }

    for (const grupo of datosSegundaBola) {
      const sumaGrupo = grupo.resultados.reduce(
        (acc, res) => acc + Number(res.valor || 0),
        0
      );
      if (sumaGrupo !== 100) {
        setError(`La suma de probabilidades para "${grupo.distancia}" en Probabilidad Segunda Bola debe ser 100%`);
        return false;
      }
    }

    if (!iteracionesYRango || !iteracionesYRango.iteraciones || iteracionesYRango.iteraciones <= 0) {
      setError("Debe ingresar una cantidad válida de iteraciones.");
      return false;
    }

    setError("");
    return true;
  };

  // Manejar envío al backend
  const handleEnviar = async () => {
    if (!validarProbabilidades()) return;
    setLoading(true);
    const payload = { probabilidades, datosSegundaBola, iteracionesYRango };
    try {
      const response = await axios.post("http://127.0.0.1:5000/simular", payload);
      console.log("Respuesta backend:", response.data);
      setResultados(response.data);
      setShowModal(true);
    } catch (e) {
      if (e.response) {
        setError("Error del servidor: " + e.response.data);
      } else {
        setError("Error en la comunicación con el servidor: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarGolf backgroundImage="/golf.jpg" />
      <Container fluid style={{ paddingTop: "15vh", minHeight: "85vh", marginTop: "3vh", width: "100vw" }}>
        <Row className="justify-content-center">
          <Col md={3} className="mb-4 mx-2" style={{
            boxShadow: "0 4px 8px rgba(0,0,0,.6)",
            borderRadius: "0.5rem",
            backgroundColor: "white",
            padding: "1rem"
          }}>
            <ProbabilidadTabla probabilidades={probabilidades} setProbabilidades={setProbabilidades} />
          </Col>
          <Col md={3} className="mb-4 mx-3" style={{
            boxShadow: "0 4px 8px rgba(0,0,0,.6)",
            borderRadius: "0.5rem",
            backgroundColor: "white",
            padding: "1rem"
          }}>
            <ProbabilidadSegundaBola datos={datosSegundaBola} setDatos={setDatosSegundaBola} />
          </Col>
          <Col md={3} className="mb-4 mx-2" style={{
            boxShadow: "0 4px 8px rgba(0,0,0,.6)",
            borderRadius: "0.5rem",
            backgroundColor: "white",
            padding: "1rem",
            flex: "0 0 auto"
          }}>
            <IteracionesYRangoInput onSubmit={setIteracionesYRango} />
          </Col>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col md={3}>
            <Button variant="success" onClick={handleEnviar} disabled={loading} className="w-100">
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                  Enviando...
                </>
              ) : "Validar y Enviar"}
            </Button>
          </Col>
        </Row>

        {error && (
          <Row className="justify-content-center mt-3">
            <Col md={6}>
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            </Col>
          </Row>
        )}

        {/* Modal de Resultados */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Resultados de la Simulación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {resultados && (
              <>
                <h5>
                  Probabilidad de más de 125 puntos: <strong>{resultados.probabilidad.toFixed(2)}%</strong>
                </h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Reloj</th>
                      <th>i</th>
                      <th>Número Aleatorio</th>
                      <th>Resultado Primer Tiro</th>
                      <th>Número Aleatorio Segundo</th>
                      <th>Resultado Segundo Tiro</th>
                      <th>Puntaje</th>
                      <th>Total Puntos</th>
                      <th>Cantidad de veces superado el puntaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.vectores.map((vec, index) => (
                      <tr key={index}>
                        <td>{vec[8]}</td>
                        <td>{vec[0]}</td>
                        <td>{vec[1].toFixed(2)}</td>
                        <td>{vec[2]}</td>
                        <td>{vec[3]?.toFixed(2) || "-"}</td>
                        <td>{vec[4] === true ? "Emboca" : vec[4] === false ? "Falla" : "-"}</td>
                        <td>{vec[5]}</td>
                        <td>{vec[6]}</td>
                        <td>{vec[7]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default App;