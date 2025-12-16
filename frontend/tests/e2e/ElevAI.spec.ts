import { test, expect } from '@playwright/test';

test.describe('ElevAI – Tests E2E', () => {

  test('T1 - Création utilisateur → redirection vers /add-entry', async ({ page }) => {

    await page.goto('http://localhost:5173/signup');

    const username = `user${Date.now()}`;

    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', 'test1234');
    await page.fill('input[name="age"]', '25');
    await page.fill('input[name="weight"]', '70');
    await page.fill('input[name="height"]', '175');
    await page.fill('input[name="gender"]', 'Homme');
    await page.fill('input[name="objective"]', 'Forme');

    //Attendre l’appel API signup
    await Promise.all([
    page.waitForResponse(resp =>
      resp.url().includes('/users') && resp.status() === 200
    ),
    page.getByRole('button', { name: /s’inscrire/i }).click()
  ]);

    //Vérifier que le token est bien enregistré
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).not.toBeNull();

    //Vérifier la redirection
    await page.waitForURL('**/add-entry', { timeout: 10000 });
  });
test('T2 - Ajout d’une journée → vérification message et réinitialisation', async ({ page }) => {

  // Injecter token et userId dans localStorage pour passer la redirection
  await page.goto('http://localhost:5173'); 
  await page.evaluate(() => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '1'); 
  });
  await page.goto('http://localhost:5173/add-entry');
  await page.waitForSelector('form.add-entry-form');

  const today = new Date().toISOString().split('T')[0];

  await page.fill('input[name="date"]', today);
  await page.fill('input[name="sommeil_h"]', '7.5');
  await page.fill('input[name="pas"]', '9000');
  await page.fill('input[name="sport_min"]', '30');
  await page.fill('input[name="calories"]', '2200');
  await page.fill('input[name="humeur_0_5"]', '4');
  await page.fill('input[name="stress_0_5"]', '2');
  await page.fill('input[name="fc_repos"]', '60');

  await page.getByRole('button', { name: /enregistrer la journée/i }).click();

  await expect(page.locator('text=Données enregistrées ✅')).toBeVisible();
});

test('T3 - Appel de l’analyse → affichage du score et des recommandations', async ({ page }) => {

  // Injecter token et userId dans localStorage pour simuler utilisateur connecté
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '1'); 
  });

  // Aller sur le dashboard
  await page.goto('http://localhost:5173/dashboard');

  // Attendre que le ScoreCard et recommandations soient visibles
  await page.waitForSelector('.dashboard-container');

  // Vérifier qu'un score est affiché
  await expect(page.locator('.score-card')).toBeVisible();

  // Vérifier que la section recommandations est visible
  await expect(page.locator('.recommendations-card')).toBeVisible();

  // Vérifier qu'il y a au moins une recommandation affichée
  await expect(page.locator('.recommendations-list li').first()).toBeVisible();
});

test('T4 - Le graphe d’évolution se met à jour après ajout d’une journée', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userId', '1');
  });

  // Aller sur la page d'ajout
  await page.goto('http://localhost:5173/add-entry');

  await page.waitForSelector('form.add-entry-form');

  // Ajouter une nouvelle journée
  const today = new Date().toISOString().split('T')[0];

  await page.fill('input[name="date"]', today);
  await page.fill('input[name="sommeil_h"]', '8');
  await page.fill('input[name="pas"]', '10000');
  await page.fill('input[name="sport_min"]', '45');
  await page.fill('input[name="calories"]', '2100');
  await page.fill('input[name="humeur_0_5"]', '4');
  await page.fill('input[name="stress_0_5"]', '2');
  await page.fill('input[name="fc_repos"]', '60');

  await page.getByRole('button', { name: /enregistrer la journée/i }).click();

  await expect(page.locator('text=Données enregistrées')).toBeVisible();

  // 3Aller au dashboard
  await page.goto('http://localhost:5173/dashboard');

  await expect(page.locator('text=Bienvenue sur ton Dashboard')).toBeVisible();

  // Vérifier que le graphe a des points
  const points = page.locator('svg circle');
  expect(await points.count()).toBeGreaterThan(0);
});

});