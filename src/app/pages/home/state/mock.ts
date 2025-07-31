import { CardImage } from '../../../components/card/models';
import { LoginService, RegionalService } from './models';

export const LOGIN_SERVICES: LoginService[] = [
  {
    title: 'Autenticati',
    description: 'Accedi tramite IDP Emilia-Romagna in modo sicuro e veloce.',
    href: '',
  },
  {
    title: 'Scegli i servizi',
    description:
      'Puoi entrare a uno o più servizi digitali già profilati per te.',
    href: '',
  },
  {
    title: 'Single Sign-On',
    description:
      'Una sola autenticazione vale per tutte le applicazioni aperte.',
    href: '',
  },
  {
    title: 'Disconnessione',
    description:
      'Uscendo da una delle app, verrai disconnesso da tutte le altre.',
    href: '',
  },
];

export const REGIONAL_SERVICES: RegionalService[] = [
  {
    id: 'mammografia',
    title: 'Screening Mammografico',
    description:
      'Controlla e gestisci le attività di screening per la prevenzione del tumore al seno.',
    href: '',
  },
  {
    id: 'colon',
    title: 'Screening Colon retto',
    description:
      'Visualizza le liste, prenota esami e monitora gli inviti per la prevenzione del cancro del colon.',
    href: '',
  },
  {
    id: 'citologico',
    title: 'Screening Citologico',
    description: 'Gestione inviti e follow-up per lo screening cervicale.',
    href: '',
  },
  {
    id: 'vaccinazioni',
    title: 'Vaccinazioni',
    description:
      'Consulta lo stato vaccinale dei cittadini, prenota o registra una somministrazione.',
    href: '',
  },
  {
    id: 'sanita',
    title: 'Igiene Sanità Pubblica',
    description:
      'Monitora, segnala e intervieni in attività di sanità pubblica territoriale.',
    href: '',
  },
  {
    id: 'sicurezza-lavoro',
    title: 'Prevenzione Sicurezza Lavoro',
    description:
      'Gestione delle attività ispettive e di controllo in ambito lavorativo.',
    href: '',
  },
  {
    id: 'impianti',
    title: 'Unità Impiantistica Antinfortunistica',
    description:
      'Supervisiona impianti e attrezzature per la prevenzione degli infortuni.',
    href: '',
  },
  {
    id: 'veterinario',
    title: 'Veterinario',
    description:
      'Accedi ai servizi di controllo sanitario veterinario e sicurezza alimentare animale.',
    href: '',
  },
  {
    id: 'alimenti',
    title: 'Igiene Alimenti',
    description:
      'Monitora e controlla le filiere alimentari secondo gli standard regionali.',
    href: '',
  },
];
