import { test, expect } from '@playwright/test';

test.describe('ElevAI End-to-End Tests', () => {

test('T1: Création d’un utilisateur', async ({ page }) => {
  await page.goto('http://localhost:5173/signup');

  // Remplir le formulaire utilisateur
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', '123456');
  await page.fill('input[name="age"]', '28');
  await page.fill('input[name="weight"]', '74');
  await page.fill('input[name="height"]', '178');
  await page.fill('input[name="gender"]', 'Homme');        // input text, pas select
  await page.fill('input[name="objective"]', 'Améliorer le sommeil'); // name correct

  // Cliquer sur le bouton S’inscrire
  await page.click('button[type="submit"]');

  // Vérifier qu’on est redirigé vers /add-entry
  await expect(page).toHaveURL(/add-entry/i);
});



 test('T2: Ajouter une journée de données', async ({ page }) => {
    // Simuler qu’un utilisateur est connecté
    await page.goto('http://localhost:5173'); 
    await page.evaluate(() => localStorage.setItem('userId', '2'));
    await page.goto('http://localhost:5173/add-entry');

    // Remplir le formulaire quotidien
    await page.fill('input[name="date"]', '2025-12-13');
    await page.fill('input[name="sommeil_h"]', '7');
    await page.fill('input[name="pas"]', '8000');
    await page.fill('input[name="sport_min"]', '30');
    await page.fill('input[name="calories"]', '2200');
    await page.fill('input[name="humeur_0_5"]', '4');
    await page.fill('input[name="stress_0_5"]', '2');
    await page.fill('input[name="fc_repos"]', '60');

    // Cliquer sur le bouton submit
    await page.click('[data-testid="add-entry-btn"]');

    // Vérifier le message de confirmation
    await expect(page.locator('text=Données enregistrées')).toBeVisible();
});


 test('T3: Affichage du score et recommandations', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard');

  // Vérifier présence du score
  await expect(page.locator('.score-card')).toBeVisible();

  // Vérifier présence des recommandations
  await expect(page.locator('.recommendation-list')).toBeVisible();
});


  test('T4: Graphe évolution mis à jour après ajout d’une journée', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard');

  // Vérifier que le graphique existe
  await expect(page.locator('.radar-chart')).toBeVisible();
});


});