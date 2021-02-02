import { timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

import React from 'react';
import { useMergedStream, useStream } from '../src';


export default ({ a, b }: {a : string, b: string}) => {
  const [debounced] = useStream(b, debounce(() => timer(1000)));
  const [merged] = useMergedStream([debounced, a]);

  return <>{merged}</>;
};
