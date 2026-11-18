
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'

import type { RootState, AppDispatch } from '../store/store'
import {
  fetchElectricityConsumerDraft,
  createElectricityConsumer,
  publishElectricityConsumer,
} from '../store/electricityConsumersSlice'

export default function AddElectricityConsumerPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {
    draft,
    draftLoading,
    draftChecked,
    draftError,
    createLoading,
    createError,
    publishLoading,
    publishError,
  } = useSelector(
    (state: RootState) => state.electricityConsumers
  )

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [powerKW, setPowerKW] = useState('')

  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)

  const [imagePreview, setImagePreview] = useState('')
  const [videoPreview, setVideoPreview] = useState('')

  const isLoading = draftLoading || createLoading || publishLoading

  // Проверяем черновик при открытии страницы
  useEffect(() => {
    void dispatch(fetchElectricityConsumerDraft())
  }, [dispatch])

  // Предпросмотр изображения
  useEffect(() => {
    if (!image) {
      setImagePreview('')
      return
    }

    const url = URL.createObjectURL(image)
    setImagePreview(url)

    return () => URL.revokeObjectURL(url)
  }, [image])

  // Предпросмотр видео
  useEffect(() => {
    if (!video) {
      setVideoPreview('')
      return
    }

    const url = URL.createObjectURL(video)
    setVideoPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [video])

  // Создание черновика
  const handleCreate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!draftChecked || !name.trim() || !image || !video) {
      return
    }

    try {
      await dispatch(
        createElectricityConsumer({
          name: name.trim(),
          image,
          video,
        })
      ).unwrap()
    } catch {
      // Ошибку показывает Redux
    }
  }

  // Публикация прибора
  const handlePublish = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!draft?.id || !description.trim()) return

    const power = Number(powerKW)

    if (!Number.isFinite(power) || power <= 0) return

    try {
      await dispatch(
        publishElectricityConsumer({
          id: draft.id,
          description: description.trim(),
          powerKW: power,
        })
      ).unwrap()

      navigate('/catalog')
    } catch {
      // Ошибку показывает Redux
    }
  }

  return (
    <main className="add-page">
      <h1 className="screen-title">
        Добавление прибора
      </h1>

      {!draftChecked ? (
        <div className="text-center my-4">
          {draftLoading ? (
            <>
              <Spinner animation="border" role="status" />
              <p>Проверка черновика...</p>
            </>
          ) : (
            <p className="text-danger">
              {draftError || 'Не удалось проверить черновик.'}
            </p>
          )}
        </div>
      ) : !draft ? (
        <form
          className="draft-form"
          onSubmit={handleCreate}
        >
          <div className="add-media-stack">
            <label className="media-picker">
              <span className="add-media-title">
                Изображение
              </span>

              <div className="add-media-preview-wide">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Предпросмотр изображения"
                  />
                ) : (
                  <span>Выбрать фото</span>
                )}
              </div>

              <input
                className="media-file-input"
                type="file"
                accept="image/*"
                required
                disabled={isLoading}
                onChange={(event) =>
                  setImage(event.target.files?.[0] ?? null)
                }
              />

              <span className="media-picker-hint">
                {image?.name || 'Нажмите для выбора файла'}
              </span>
            </label>

            <label className="media-picker">
              <span className="add-media-title">
                Видео
              </span>

              <div className="add-media-preview-wide">
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <span>Выбрать видео</span>
                )}
              </div>

              <input
                className="media-file-input"
                type="file"
                accept="video/*,.mp4"
                required
                disabled={isLoading}
                onChange={(event) =>
                  setVideo(event.target.files?.[0] ?? null)
                }
              />

              <span className="media-picker-hint">
                {video?.name || 'Нажмите для выбора файла'}
              </span>
            </label>
          </div>

          <label className="form-label">
            Название электроприбора
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              maxLength={100}
              disabled={isLoading}
            />
          </label>

          {createError && (
            <p className="text-danger">{createError}</p>
          )}

          <button
            type="submit"
            className="form-button"
            disabled={isLoading || !image || !video}
          >
            {createLoading ? (
              <>
                <Spinner size="sm" animation="border" />{' '}
                Создание...
              </>
            ) : (
              'Далее'
            )}
          </button>
        </form>
      ) : (
        <form
          className="draft-form"
          onSubmit={handlePublish}
        >
          <p className="form-hint">
            Черновик создан. Заполните данные
            для публикации прибора.
          </p>

          <label className="form-label">
            Описание электроприбора
            <textarea
              className="form-textarea"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
              maxLength={255}
              disabled={isLoading}
            />
          </label>

          <label className="form-label">
            Мощность, кВт
            <input
              className="form-input"
              type="number"
              min="0.1"
              step="0.1"
              value={powerKW}
              onChange={(event) =>
                setPowerKW(event.target.value)
              }
              required
              disabled={isLoading}
            />
          </label>

          {publishError && (
            <p className="text-danger">{publishError}</p>
          )}

          <button
            type="submit"
            className="form-button"
            disabled={isLoading || !draft?.id}
          >
            {publishLoading ? (
              <>
                <Spinner size="sm" animation="border" />{' '}
                Публикация...
              </>
            ) : (
              'Опубликовать'
            )}
          </button>
        </form>
      )}
    </main>
  )
}
