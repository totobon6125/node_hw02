import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ['query', 'info', 'warn', 'error'],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: 'pretty',
}); // PrismaClient 인스턴스를 생성합니다.

/* 여러 라우터 파일에서 sql 연결하는 코드를 작성하면 연결요청을 많이 해야하므로 하나로 통합하는 과정 */

