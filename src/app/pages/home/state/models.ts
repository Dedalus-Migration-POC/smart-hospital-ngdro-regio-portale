export interface LoginService {
  title: string;
  description: string;
  href: string;
}

// TODO: da capire come settare dinamicamente i path img
// quando si avranno i servizi BE
// id => nel mock nome del servizio per esempio mammografia
// per le card image img è id + ".svg"
export interface RegionalService {
  id: string;
  title: string;
  description: string;
  href: string;
}
