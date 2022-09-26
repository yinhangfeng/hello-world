import { generateTestLineData1 } from '@/utils/testData';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import LineChart from './LineChart';

export default function Page() {
  const [data, setData] = useState<any[]>(undefined);
  useEffect(() => {
    setData(generateTestLineData1());
  }, []);
  return (
    <div>
      <h1 className={styles.title}>G2 Line Chart</h1>
      {data && (
        <LineChart
          data={data}
          style={{
            width: '100%',
          }}
        />
      )}
    </div>
  );
}
