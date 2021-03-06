import { useRef, useEffect, useState } from 'react';

import { Op } from './types';

import pipe from 'callbag-pipe';
import { Observable, Observer, of, Subject, merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import useRxJSObservable from './hooks/useRxJSObservable';


export type Combinator<X, Y> = (sources: Observable<X>[]) => Observable<Y>;

export function useStreams<T, W>(sources: T[], combinator: Combinator<T, W>): [W, boolean];
export function useStreams<T, W, A>(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>): [A, boolean];
export function useStreams<T, W, A, B>
(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>, b: Op<A, B>): [B, boolean];
export function useStreams<T, W, A, B, C>
(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>, b: Op<A, B>, c: Op<B, C>): [C, boolean];
export function useStreams<T, W, A, B, C, D>
(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>): [D, boolean];
export function useStreams<T, W, A, B, C, D, E>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>
): [E, boolean];
export function useStreams<T, W, A, B, C, D, E, F>
(sources: T[],  combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>
): [F, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>): [G, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>, h: Op<G, H>
): [H, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H, I>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>
):[I, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H, I, J>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>
): [J, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H, I, J, K>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>, l: Op<J, K>
): [K, boolean];
export function useStreams<T, W>(sources: T[], combinator: Combinator<T, W>, ...pipes: Op<any, any>[]): any;


export function useStreams<T, W>(sources: T[], combinator: Combinator<T, W>, ...pipes: ((x: any) => any)[]) {
  const srcs = useRef<(Observable<T> & Observer<T>)[]>();
  const [loading, setLoading] = useState(false);

  sources.forEach((source, i) => {
    useEffect(() => {
      if (!srcs.current) {
        srcs.current = [];
      }

      if (!srcs.current[i]) {
        srcs.current[i] = new Subject<T>();
      }

      srcs.current[i].next(source);
    }, [source]);
  });

  return [
    useRxJSObservable(undefined, () => (pipe as any)(
      combinator(srcs.current!.map((s, i) => merge(s, of(sources[i])))),
      tap(() => setLoading(true)),
      ...pipes,
      tap(() => setLoading(false)),
    )),
    loading
  ];
}
