
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import type { ElectricityConsumer } from '../types/ElectricityConsumer'

interface Props {
  consumers: ElectricityConsumer[]
}

export default function CatalogPage({ consumers }: Props) {
  const navigate = useNavigate()

  const [minPower, setMinPower] = useState(0)
  const [maxPower, setMaxPower] = useState(5)

  const [appliedMin, setAppliedMin] = useState(0)
  const [appliedMax, setAppliedMax] = useState(5)

  const filteredConsumers = consumers.filter(
    (consumer) =>
      consumer.powerKW >= appliedMin &&
      consumer.powerKW <= appliedMax
  )

  const handleFilter = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedMin(minPower)
    setAppliedMax(maxPower)
  }

  return (
    <main className="catalog-page">
      <h1 className="screen-title">Каталог</h1>

      <div className="filter-title">
        Фильтр по мощности
      </div>

      <form className="filter-form" onSubmit={handleFilter}>
        <div className="filter-values">
          <span>от {minPower.toFixed(1)} кВт</span>
          <span>до {maxPower.toFixed(1)} кВт</span>
        </div>

        <div className="dual-range">
          <input
            className="range-input range-min"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={minPower}
            onChange={(event) =>
              setMinPower(
                Math.min(Number(event.target.value), maxPower)
              )
            }
          />

          <input
            className="range-input range-max"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={maxPower}
            onChange={(event) =>
              setMaxPower(
                Math.max(Number(event.target.value), minPower)
              )
            }
          />
        </div>

        <Button type="submit" className="filter-button">
          найти
        </Button>
      </form>

      {filteredConsumers.length > 0 ? (
        <div className="catalog-grid">
          {filteredConsumers.map((consumer) => (
            <Card className="service-card" key={consumer.id}>
              <div className="card-image-wrap">
                <Card.Img
                  src={consumer.image || '/media/default.jpg'}
                  alt={consumer.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = '/media/default.jpg'
                  }}
                />

                <span className="card-like">
                  ♡ {consumer.likes}
                </span>
              </div>

              <Card.Body>
                <Card.Title>{consumer.name}</Card.Title>

                <Card.Text>
                  {consumer.powerKW.toFixed(1)} кВт
                </Card.Text>

                <div className="card-actions">
                  <Button
                    onClick={() =>
                      navigate(`/?id=${consumer.id}`)
                    }
                  >
                    Подробнее
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p className="empty-result">
          Приборы с такой мощностью не найдены.
        </p>
      )}
    </main>
  )
}
