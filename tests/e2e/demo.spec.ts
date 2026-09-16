import {test,expect} from '@playwright/test';
test('driver confirmation reaches parent and dispatcher notice reaches student',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Driver',exact:true}).click();
 await page.getByRole('button',{name:'Open route'}).click();await page.getByRole('button',{name:'Start trip',exact:true}).click();
 await page.getByRole('button',{name:'Pick up Alex R.',exact:true}).click();
 await page.getByRole('button',{name:'Parent',exact:true}).click();await expect(page.getByText('ONBOARD',{exact:true})).toBeVisible();await expect(page.getByText('Jordan M.',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Dispatcher',exact:true}).click();await page.getByRole('button',{name:'Updates',exact:true}).click();
 await page.getByLabel('Service message').fill('Traffic delay: please allow ten extra minutes.');await page.getByRole('button',{name:'Publish update'}).click();
 await page.getByRole('button',{name:'Student',exact:true}).click();await expect(page.getByText('Traffic delay: please allow ten extra minutes.')).toBeVisible();
});
