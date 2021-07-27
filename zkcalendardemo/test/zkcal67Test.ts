import { Selector } from 'testcafe';

fixture('zkcal67')
	.page('http://localhost:8080/zkcalendardemo/test/zkcal67.zul');

test('test', async t => {
	await t
		.expect(Selector('.z-calendars').exists).eql(true)
		.expect(Selector('.z-messagebox-error').exists).eql(false);
});