/* zkcal88Test.ts

		Purpose:
		
		Description:
		
		History:
				Thu Dec 23 11:51:51 CST 2021, Created by leon

Copyright (C) 2021 Potix Corporation. All Rights Reserved.
*/

import { Selector } from 'testcafe';

fixture('zkcal88')
	.page('http://localhost:8080/zkcalendardemo/test/zkcal88.zul');

test('test', async t => {
	await t
		.expect(Selector('.z-calitem').nth(0).hasClass('myclass')).eql(true)
		.expect(Selector('.z-calitem').nth(0).hasClass('custom')).eql(true)
		.expect(Selector('.z-calitem').nth(1).hasClass('myclass')).eql(true)
});