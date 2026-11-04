
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import type { ElectricityConsumer } from '../types/ElectricityConsumer'

interface Props {
  consumers: ElectricityConsumer[]
}

export default function FeedPage({ consumers }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const consumer = consumers[currentIndex]

  if (!consumer) {
    return <main className="feed-screen">Нет электроприборов</main>
  }

  const handleNext = () => {
    setCurrentIndex((index) => (index + 1) % consumers.length)
    setExpanded(false)
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
        <div className="feed-like">
          <span className="feed-heart">♡</span>
          <span className="feed-like-count">{consumer.likes}</span>
        </div>

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
