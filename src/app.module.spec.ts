import { Test, TestingModule } from '@nestjs/testing';

describe('AppModule', () => {
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({}).compile();
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });
});
