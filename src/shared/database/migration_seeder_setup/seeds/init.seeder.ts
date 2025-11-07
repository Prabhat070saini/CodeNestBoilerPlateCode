import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

export default class InitSeeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const seeds = [
      /* add your seeders here */
    ];

    // Only run if seeds array is not empty
    if (seeds.length === 0) {
      console.log('No seeders to run. Skipping seeding...');
      return;
    }

    await runSeeders(dataSource, {
      seeds,
      factories: [],
    });

    console.log('Seeding completed.');
  }
}
