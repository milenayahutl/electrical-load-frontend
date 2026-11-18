
import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { electricityConsumersApi } from '../api/electricityConsumersClient'
import type {
  DsElectricityConsumerResponse,
  DsElectricityConsumerFeedResponse,
} from '../api/generated/ElectricityConsumersApi'

interface ElectricityConsumersState {
  items: DsElectricityConsumerResponse[]
  loading: boolean
  error: string | null

  feed: DsElectricityConsumerFeedResponse | null
  feedLoading: boolean
  feedError: string | null

  likeLoading: boolean
  likeError: string | null

  deleteLoading: boolean
  deleteError: string | null

  draft: DsElectricityConsumerResponse | null
  draftLoading: boolean
  draftChecked: boolean
  draftError: string | null

  createLoading: boolean
  createError: string | null

  publishLoading: boolean
  publishError: string | null
}

const initialState: ElectricityConsumersState = {
  items: [],
  loading: false,
  error: null,

  feed: null,
  feedLoading: false,
  feedError: null,

  likeLoading: false,
  likeError: null,

  deleteLoading: false,
  deleteError: null,

  draft: null,
  draftLoading: false,
  draftChecked: false,
  draftError: null,

  createLoading: false,
  createError: null,

  publishLoading: false,
  publishError: null,
}

// Получение каталога
export const fetchElectricityConsumers = createAsyncThunk(
  'electricityConsumers/fetch',
  async (filter: { minPower: number; maxPower: number }) => {
    const response =
      await electricityConsumersApi.electricityConsumers.electricityConsumersList(
        {
          min_power: filter.minPower,
          max_power: filter.maxPower,
        },
        { secure: true }
      )

    return response.data
  }
)

// Получение ленты
export const fetchElectricityConsumerFeed = createAsyncThunk(
  'electricityConsumers/fetchFeed',
  async ({ id, next = false }: { id: number; next?: boolean }) => {
    const response =
      await electricityConsumersApi.electricityConsumers.feedDetail(
        id,
        { next }
      )

    return response.data
  }
)

export const changeElectricityConsumerLike = createAsyncThunk(
  'electricityConsumers/changeLike',
  async ({ id, value }: { id: number; value: 0 | 1 }) => {
    const response =
      await electricityConsumersApi.electricityConsumers.likesCreate(
        id,
        { value }
      )

    return {
      id,
      value,
      likesCount: response.data.likes_count,
    }
  }
)

export const deleteElectricityConsumer = createAsyncThunk(
  'electricityConsumers/delete',
  async (id: number) => {
    await electricityConsumersApi.electricityConsumers.electricityConsumersDelete(
      id
    )

    return id
  }
)

// Проверка существующего черновика
export const fetchElectricityConsumerDraft = createAsyncThunk(
  'electricityConsumers/fetchDraft',
  async () => {
    try {
      const response =
        await electricityConsumersApi.electricityConsumers.draftList()

      return response.data
    } catch (error) {
      // 404 означает, что у пользователя ещё нет черновика
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }

      throw error
    }
  }
)

// Создание черновика с изображением и видео
export const createElectricityConsumer = createAsyncThunk(
  'electricityConsumers/create',
  async (data: {
    name: string
    image: File
    video: File
  }) => {
    const response =
      await electricityConsumersApi.electricityConsumers.electricityConsumersCreate(
        data
      )

    return response.data
  }
)

export const publishElectricityConsumer = createAsyncThunk(
  'electricityConsumers/publish',
  async (data: {
    id: number
    description: string
    powerKW: number
  }) => {
    const response =
      await electricityConsumersApi.electricityConsumers.electricityConsumersUpdate(
        data.id,
        {
          description: data.description,
          power_kw: data.powerKW,
        }
      )

    return response.data
  }
)

const electricityConsumersSlice = createSlice({
  name: 'electricityConsumers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Каталог
      .addCase(fetchElectricityConsumers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchElectricityConsumers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchElectricityConsumers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Ошибка загрузки приборов'
      })

      // Лента
      .addCase(fetchElectricityConsumerFeed.pending, (state) => {
        state.feedLoading = true
        state.feedError = null
      })
      .addCase(fetchElectricityConsumerFeed.fulfilled, (state, action) => {
        state.feedLoading = false
        state.feed = action.payload
      })
      .addCase(fetchElectricityConsumerFeed.rejected, (state, action) => {
        state.feedLoading = false
        state.feedError = action.error.message || 'Ошибка загрузки ленты'
      })

      // Лайки
      .addCase(changeElectricityConsumerLike.pending, (state) => {
        state.likeLoading = true
        state.likeError = null
      })
      .addCase(changeElectricityConsumerLike.fulfilled, (state, action) => {
        state.likeLoading = false

        const { id, value, likesCount } = action.payload

        if (state.feed?.id === id) {
          state.feed.is_liked = value

          if (likesCount !== undefined) {
            state.feed.likes_count = likesCount
          }
        }

        const consumer = state.items.find(
          (item) => item.id === id
        )

        if (consumer && likesCount !== undefined) {
          consumer.likes_count = likesCount
        }
      })
      .addCase(changeElectricityConsumerLike.rejected, (state, action) => {
        state.likeLoading = false
        state.likeError = action.error.message || 'Ошибка изменения лайка'
      })

      // Удаление
      .addCase(deleteElectricityConsumer.pending, (state) => {
        state.deleteLoading = true
        state.deleteError = null
      })
      .addCase(deleteElectricityConsumer.fulfilled, (state, action) => {
        state.deleteLoading = false

        state.items = state.items.filter(
          (item) => item.id !== action.payload
        )
      })
      .addCase(deleteElectricityConsumer.rejected, (state, action) => {
        state.deleteLoading = false
        state.deleteError = action.error.message || 'Ошибка удаления прибора'
      })

      // Загрузка существующего черновика
      .addCase(fetchElectricityConsumerDraft.pending, (state) => {
        state.draftLoading = true
        state.draftChecked = false
        state.draftError = null
      })
      .addCase(fetchElectricityConsumerDraft.fulfilled, (state, action) => {
        state.draftLoading = false
        state.draftChecked = true
        state.draft = action.payload
      })
      .addCase(fetchElectricityConsumerDraft.rejected, (state, action) => {
        state.draftLoading = false
        state.draftChecked = false
        state.draftError = action.error.message || 'Ошибка загрузки черновика'
      })

      // Создание черновика
      .addCase(createElectricityConsumer.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createElectricityConsumer.fulfilled, (state, action) => {
        state.createLoading = false
        state.draft = action.payload
        state.draftChecked = true
      })
      .addCase(createElectricityConsumer.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.error.message || 'Ошибка создания прибора'
      })

      // Публикация
      .addCase(publishElectricityConsumer.pending, (state) => {
        state.publishLoading = true
        state.publishError = null
      })
      .addCase(publishElectricityConsumer.fulfilled, (state) => {
        state.publishLoading = false
        state.draft = null
      })
      .addCase(publishElectricityConsumer.rejected, (state, action) => {
        state.publishLoading = false
        state.publishError = action.error.message || 'Ошибка публикации прибора'
      })
  },
})

export default electricityConsumersSlice.reducer
