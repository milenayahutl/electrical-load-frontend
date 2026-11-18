import { mediaUrl } from '../api/mediaUrl'
import { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import type { ElectricityConsumer } from '../types/ElectricityConsumer'
import type { RootState, AppDispatch } from '../store/store'
import {
  fetchElectricityConsumerFeed,
  changeElectricityConsumerLike,
} from '../store/electricityConsumersSlice'

interface Props {
  consumers: ElectricityConsumer[]
}

export default function FeedPage({ consumers }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams] = useSearchParams()

  const requestedId = Number(searchParams.get('id'))
  const initialId =
    Number.isInteger(requestedId) && requestedId > 0
      ? requestedId
      : 1

  const [currentIndex, setCurrentIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const {
    feed,
    feedLoading,
    feedError,
    likeLoading,
  } = useSelector(
    (state: RootState) => state.electricityConsumers
  )

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  // Загружаем прибор с Go-сервера
  useEffect(() => {
    const index = consumers.findIndex(
      (item) => item.id === initialId
    )

    setCurrentIndex(index >= 0 ? index : 0)
    setExpanded(false)

    void dispatch(fetchElectricityConsumerFeed({
      id: initialId,
    }))
  }, [dispatch, initialId, consumers])

  // Mock используется только гостем при ошибке API
  const useMock = Boolean(feedError) && !isAuthenticated

  const consumer: ElectricityConsumer | null = useMock
    ? consumers[currentIndex] ?? null
    : feed && !feedError
      ? {
          id: feed.id ?? 0,
          name: feed.name ?? '',
          description: feed.description ?? '',
          powerKW: feed.power_kw ?? 0,
          currentA: feed.current_a ?? 0,
          image: mediaUrl(feed.image, '/media/default.jpg'),
          video: mediaUrl(feed.video, '/media/default.mp4'),
          likes: feed.likes_count ?? 0,
        }
      : null

  const handleLike = () => {
    if (!isAuthenticated || !feed || likeLoading) return

    const value: 0 | 1 = feed.is_liked === 1 ? 0 : 1

    void dispatch(changeElectricityConsumerLike({
      id: feed.id ?? 0,
      value,
    }))
  }

  const handleNext = () => {
    if (!consumer || feedLoading) return

    setExpanded(false)

    if (useMock) {
      setCurrentIndex(
        (index) => (index + 1) % consumers.length
      )
    } else {
      void dispatch(fetchElectricityConsumerFeed({
        id: consumer.id,
        next: true,
      }))
    }
  }

  if (feedLoading) {
    return (
      <main className="feed-screen d-flex align-items-center justify-content-center">
        <div className="text-center text-white">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Загрузка прибора...</p>
        </div>
      </main>
    )
  }

  if (feedError && isAuthenticated) {
    return (
      <main className="feed-screen text-white p-4">
        Не удалось загрузить прибор с сервера.
      </main>
    )
  }

  if (!consumer) {
    return (
      <main className="feed-screen">
        Нет электроприборов
      </main>
    )
  }

  return (
    <main className="feed-screen">
      <video
        key={consumer.id}
        className="feed-video"
        src={consumer.video || '/media/default.mp4'}
        poster={consumer.image || '/media/default.jpg'}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="feed-gradient" />

      <div className="feed-copy">
        <h1>{consumer.name}</h1>

        <p className={expanded ? '' : 'feed-description'}>
          {consumer.description}
        </p>

        <button
          type="button"
          className="feed-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'меньше' : 'больше'}
        </button>
      </div>

      <div className="feed-actions">
      <button
        type="button"
        className="feed-like"
        onClick={handleLike}
        disabled={!isAuthenticated || likeLoading}
      >
        <span className="feed-heart">
          {isAuthenticated && feed?.is_liked === 1 ? '♥' : '♡'}
        </span>
        <span className="feed-like-count">
          {consumer.likes}
        </span>
      </button>

        <div className="feed-parameter">
          <span className="feed-parameter-value">
            {consumer.powerKW.toFixed(1)}
          </span>
          <span className="feed-parameter-unit">кВт</span>
        </div>

        <div className="feed-parameter">
          <span className="feed-parameter-value">
            {consumer.currentA.toFixed(1)}
          </span>
          <span className="feed-parameter-unit">А</span>
        </div>

        <Button
          variant="link"
          className="feed-next"
          onClick={handleNext}
        >
          ↓
        </Button>
      </div>
    </main>
  )
}
