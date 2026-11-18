import { mediaUrl } from '../api/mediaUrl'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Spinner } from 'react-bootstrap'

import type { ElectricityConsumer } from '../types/ElectricityConsumer'
import type { RootState, AppDispatch } from '../store/store'
import {
  setMinPower,
  setMaxPower,
  applyFilter,
} from '../store/filterSlice'
import {
  fetchElectricityConsumers,
  deleteElectricityConsumer,
} from '../store/electricityConsumersSlice'

interface Props {
  consumers: ElectricityConsumer[]
}

export default function CatalogPage({ consumers }: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {
    minPower,
    maxPower,
    appliedMin,
    appliedMax,
  } = useSelector((state: RootState) => state.filter)

  const {
    items,
    loading,
    error,
    deleteLoading,
    deleteError,
  } = useSelector(
    (state: RootState) => state.electricityConsumers
  )

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  // Получаем реальные приборы с сервера
  useEffect(() => {
    void dispatch(fetchElectricityConsumers({
      minPower: appliedMin,
      maxPower: appliedMax,
    }))
  }, [dispatch, appliedMin, appliedMax])

  // Преобразуем поля API в формат React из ЛР5
  const apiConsumers: ElectricityConsumer[] = items.map(
    (item) => ({
      id: item.id ?? 0,
      name: item.name ?? '',
      description: item.description ?? '',
      powerKW: item.power_kw ?? 0,
      currentA: item.current_a ?? 0,
      image: mediaUrl(item.image, '/media/default.jpg'),
      video: mediaUrl(item.video, '/media/default.mp4'),
      likes: item.likes_count ?? 0,
    })
  )

  // При недоступности сервера гость использует mock
  const filteredConsumers = error && !isAuthenticated
    ? consumers.filter(
        (consumer) =>
          consumer.powerKW >= appliedMin &&
          consumer.powerKW <= appliedMax
      )
    : error
      ? []
      : apiConsumers

  const handleFilter = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(applyFilter())
  }

  // Удаление собственного прибора
  const handleDelete = (id: number) => {
    if (!window.confirm('Удалить электрический прибор?')) {
      return
    }

    void dispatch(deleteElectricityConsumer(id))
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
            disabled={loading || deleteLoading}
            onChange={(event) =>
              dispatch(
                setMinPower(
                  Math.min(Number(event.target.value), maxPower)
                )
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
            disabled={loading || deleteLoading}
            onChange={(event) =>
              dispatch(
                setMaxPower(
                  Math.max(Number(event.target.value), minPower)
                )
              )
            }
          />
        </div>

        <Button
          type="submit"
          className="filter-button"
          disabled={loading || deleteLoading}
        >
          найти
        </Button>
      </form>

      {deleteError && (
        <p className="text-danger">{deleteError}</p>
      )}

      {loading || deleteLoading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" />
          <p>
            {deleteLoading
              ? 'Удаление прибора...'
              : 'Загрузка приборов...'}
          </p>
        </div>
      ) : error && isAuthenticated ? (
        <p className="empty-result">
          Не удалось загрузить приборы с сервера.
        </p>
      ) : (
        <>
          {error && !isAuthenticated && (
            <p>Сервер недоступен. Показаны mock-данные.</p>
          )}

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
                        disabled={deleteLoading}
                        onClick={() =>
                          navigate(`/?id=${consumer.id}`)
                        }
                      >
                        Подробнее
                      </Button>

                      {isAuthenticated &&
                        items.find(
                          (item) => item.id === consumer.id
                        )?.is_creator === 1 && (
                          <Button
                            disabled={deleteLoading}
                            onClick={() =>
                              handleDelete(consumer.id)
                            }
                          >
                            Удалить
                          </Button>
                        )}
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
        </>
      )}
    </main>
  )
}
