import { notFound } from 'next/navigation';
import professionsData from '../../../lib/data/professions.json';

import styles from './ProfessionDetail.module.css';

export async function generateStaticParams() {
  if (!professionsData || professionsData.length === 0) {
    return [];
  }
  return professionsData.map((profession) => ({
    id: profession.id,
  }));
}

interface ProfessionDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProfessionDetailPage({ params }: ProfessionDetailPageProps) {
  const { id } = params;
  const profession = professionsData.find(p => p.id === id);

  if (!profession) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{profession.name_ru}</h1>
        <h2 className={styles.subtitle}>({profession.name_kz})</h2>
      </header>

      <hr className={styles.hr} />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Описание</h3>
        <p className={styles.paragraph}><span className={styles.label}>RU:</span> {profession.description_ru}</p>
        <p className={styles.paragraph}><span className={styles.label}>KZ:</span> {profession.description_kz}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Финансовая информация</h3>
        <p className={styles.paragraph}><span className={styles.label}>Примерная зарплата:</span> {profession.salary_range_kz}</p>
        <p className={styles.paragraph}><span className={styles.label}>Спрос на рынке (KZ):</span> {profession.demand_kz}</p>
      </section>    

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Необходимые навыки</h3>
        <ul className={styles.list}>
          {profession.requiredSkills.map((skill, index) => (
            <li key={`${profession.id}-skill-${index}`} className={styles.listItem}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Связанные интересы</h3>
        <ul className={styles.list}>
          {profession.relatedInterests.map((interest, index) => (
            <li key={`${profession.id}-interest-${index}`} className={styles.listItem}>{interest}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Пути образования (KZ)</h3>
        <ul className={styles.list}>
          {profession.education_paths_kz.map((path, index) => (
            <li key={`${profession.id}-education-${index}`} className={styles.listItem}>{path}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}