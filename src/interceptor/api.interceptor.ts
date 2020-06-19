// providers/interceptor/api.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
  } from '@nestjs/common'
  import { Observable } from 'rxjs'
  import { map } from 'rxjs/operators'

  // 约定好的返回格式
  interface Response<T> {
    errCode: number
    errMsg: string
    data: T
  }

  @Injectable()
  export class ApiInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map(data => {
          return {
            errCode: 0,
            errMsg: '',
            data
          }
        })
      )
    }
  }