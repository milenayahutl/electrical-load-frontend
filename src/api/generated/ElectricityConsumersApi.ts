/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsElectricityConsumerFeedResponse {
  current_a?: number;
  description?: string;
  id?: number;
  image?: string;
  is_liked?: number;
  likes_count?: number;
  name?: string;
  power_kw?: number;
  video?: string;
}

export interface DsElectricityConsumerResponse {
  current_a?: number;
  description?: string;
  id?: number;
  image?: string;
  is_creator?: number;
  likes_count?: number;
  name?: string;
  power_kw?: number;
  video?: string;
}

export interface DsLikeRequest {
  value?: number;
}

export interface DsLoginRequest {
  login?: string;
  password?: string;
}

export interface DsLoginResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface DsPublishElectricityConsumerRequest {
  description?: string;
  power_kw?: number;
}

export interface DsRegisterUserRequest {
  login?: string;
  password?: string;
}

export interface DsUserResponse {
  id?: number;
  login?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title PowerCheck API
 * @version 1.0
 * @baseUrl http://localhost:8080/api
 * @contact
 *
 * Веб-сервис для учёта электрических приборов, расчёта электрического тока и публикации услуг.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Проверка логина и пароля с выдачей JWT
     *
     * @tags Аутентификация
     * @name LoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/auth/login
     */
    loginCreate: (credentials: DsLoginRequest, params: RequestParams = {}) =>
      this.request<DsLoginResponse, string>({
        path: `/auth/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отзыв текущего JWT через Redis blacklist. Ответ без тела.
     *
     * @tags Аутентификация
     * @name LogoutCreate
     * @summary Выход из системы
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<string, string>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  electricityConsumers = {
    /**
     * @description Получение опубликованных услуг с фильтрацией по мощности
     *
     * @tags Услуги
     * @name ElectricityConsumersList
     * @summary Получение списка электрических приборов
     * @request GET:/electricity_consumers
     */
    electricityConsumersList: (
      query?: {
        /** Минимальная мощность, кВт */
        min_power?: number;
        /** Максимальная мощность, кВт */
        max_power?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsElectricityConsumerResponse[], string>({
        path: `/electricity_consumers`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создание черновика с изображением и видео. Создатель определяется по JWT.
     *
     * @tags Услуги
     * @name ElectricityConsumersCreate
     * @summary Создание новой услуги 
     * @request POST:/electricity_consumers
     * @secure
     */
    electricityConsumersCreate: (
      data: {
        /** Название электроприбора */
        name: string;
        /**
         * Изображение
         * @format binary
         */
        image: File;
        /**
         * Видео
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsElectricityConsumerResponse, string>({
        path: `/electricity_consumers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение черновика текущего авторизованного пользователя
     *
     * @tags Услуги
     * @name DraftList
     * @summary Получение черновика
     * @request GET:/electricity_consumers/draft
     * @secure
     */
    draftList: (params: RequestParams = {}) =>
      this.request<DsElectricityConsumerResponse, string>({
        path: `/electricity_consumers/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение опубликованной услуги по ID или следующей услуги при next=true
     *
     * @tags Лента
     * @name FeedDetail
     * @summary Получение ленты
     * @request GET:/electricity_consumers/feed/{id}
     */
    feedDetail: (
      id: number,
      query?: {
        /** Перейти к следующей услуге */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsElectricityConsumerFeedResponse, string>({
        path: `/electricity_consumers/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление описания и мощности с расчётом силы тока. Публикация доступна создателю.
     *
     * @tags Услуги
     * @name ElectricityConsumersUpdate
     * @summary Публикация услуги
     * @request PUT:/electricity_consumers/{id}
     * @secure
     */
    electricityConsumersUpdate: (
      id: number,
      data: DsPublishElectricityConsumerRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsElectricityConsumerResponse, string>({
        path: `/electricity_consumers/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление опубликованной услуги создателем
     *
     * @tags Услуги
     * @name ElectricityConsumersDelete
     * @summary Удаление своей услуги
     * @request DELETE:/electricity_consumers/{id}
     * @secure
     */
    electricityConsumersDelete: (id: number, params: RequestParams = {}) =>
      this.request<string, string>({
        path: `/electricity_consumers/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Значение value=1 ставит лайк, value=0 снимает лайк
     *
     * @tags Услуги
     * @name LikesCreate
     * @summary Установка или снятие лайка
     * @request POST:/electricity_consumers/{id}/likes
     * @secure
     */
    likesCreate: (
      id: number,
      data: DsLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsElectricityConsumerResponse, string>({
        path: `/electricity_consumers/${id}/likes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создание нового пользователя с логином и паролем
     *
     * @tags Пользователи
     * @name UsersCreate
     * @summary Регистрация пользователя
     * @request POST:/users
     */
    usersCreate: (user: DsRegisterUserRequest, params: RequestParams = {}) =>
      this.request<DsUserResponse, string>({
        path: `/users`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
