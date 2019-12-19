```
   ____                   _ ____        _   
  / __/__ _______ _ _  __(_) / /__     (_)__
 / _// _ `/ __/  ' \ |/ / / / / -_)   / (_-<
/_/  \_,_/_/ /_/_/_/___/_/_/_/\__(_)_/ /___/
                                  |___/     
```

## Farmville Engine
… il titolo è pretenzioso :)

il sistema è base, ma permette la creazione di:

- wallet
- inventory warehouse
- entità foglia (uomini, animali, macchinari)
- entità contenitori (luoghi)

relazione tra le entità, e un solido sistema di distribuzione degli eventi su tick variabile.

ogni entità può creare relazioni con altre entità; nello specifico un'entità può essere contenuta dentro un'altra (nel caso, ad esempio, di un umano in un edificio, o di un animale in un edificio o di un umano in un macchinario, ecc)
questa relazione può essere valida o invalidata dai metodi: "validate_{{container}}" e "{{entity}}_validate" per validare rispettivamente l'essere inserito in un contenitore o nel contenere un'entità

ogni entità può essere estesa e acquisire un comportamento aggiuntivo, in questo momento:

## Estensione - Produzione

Possibilità di trasformare qualunque entità in una "produttiva", il ché significa che può produrre quantità per i **wallet** o produrre oggetti per il **warehouse**  
con la gestione di:
- quantità di slot produttivi
- quantità di slot per le code della produzione
- gestione dei costi di produzione (sia wallet che warehouse)
- gestione delle produzioni e requirements per attivarle
- gestione dei powerups per:
  - Tick di produzione necessari
  - Costi di produzione
  - Prodotto finale

## Estensione - Missioni

In sviluppo

# Edifici Standard

## Building - Market

È un edificio "dummy" dove è possibile acquistare e vendere prodotti del warehouse... in questo momento data la logica piuttosto sciocca è il punto in cui si compra il mangime per le mucche e dove si vendono le bottiglie di latte... però ha all'interno tutta la logica di qualunque entità che interagisce con tutto il sistema e fa scambio di wallet/oggetti

---

il codice nasce per poter creare un giochino in stile farmville per un'adv game per francia...

l'idea (non ancora elaborata) è quindi quella di avere un villaggio, delle mucche, un po' di edifici e produrre roba per:
- evadere gli ordini che servono per acquisire EXP + Money (wallets) 
- ogni tot EXP si sbloccano nuovi edifici, ci sono reward di Money e nuove Produzioni


---


# Requisiti

- lodash
- momentjs
- vuejs
- threejs
- gsap

# Architettura

Genericamente parlando si tratta di un sistema di contenimento e coordinamento di ***n*** oggetti di ***m*** tipi diversi e di uno strato destinato alla gestione del game play (wallets, warehouse, levels)

Il contenitore è il **Gioco**, e i gli oggetti contenuti sono le **entità base**.  

- Gioco
	- Entità Base
		- Edifici
		- Persone
		- Macchinari
		- Animali
		- ecc..
	- Wallets
		- Soldi
		- Esperienza
		- Risorsa A
		- ecc
	- Warehouse
		- Contenitore per oggetti
	- Livelli

## Entità Base

Ogni **Entità Base** è reattiva e può interagire con tutto il **gioco** mediante:
- Eventi
- Accesso Diretto all'oggetto

> La sicurezza, intersa come inter-operabilità delle entità, non è stata tenuta in considerazione durante lo sviluppo; dunque qualunque entità in qualunque **tick** andare a modificare qualunque aspetto del gioco.

Il motore di tutto il sistema è il **tick**, ed è l'unità di misura minima del tempo. È di *default* 100ms. 10 tick sono 1 secondo.

Ad ogni tick, viene invocato l'evento `tick` a tutte le entità del gioco. All'evento possono essere agganciati ***n*** metodi con funzionalità diversa; questa caratteristica permette di creare delle entità con caratteristiche variegate.

Tra le altre caratteristiche dell'entità, c'è la possibilità di creare una relazione di "contenitore/contenuto" tra altre entità l'implementazione di logiche di game play complesse tipo: "La **Produzione A** di **Macchinario 1** è abilitata se nel **Macchinario 1** c'è **1 Umano**" ecc.

Anche in fase di "Upgrade Livello" viene invocato, in ogni entità, un metodo specifico in grado di gestire eventuali modifiche all'entità sulla base del livello.

> Nel caso in cui l'avanzamento del livello della singola entità è diverso dall'intero livello di gioco, bisogna creare la propria logica di avanzamento all'interno dell'oggetto specifico, e ignorare le funzionalità di upgrade automatico del livello.

Inoltre, in fase di salvataggio della sessione, viene invocato l'evento `save-export`, e in fase di caricamento `save-load`. Questi due eventi permettono alle entità di sistemare i dati personalizzati all'esterno delle proprietà di sistema (config, specs) sia in fase di salvataggio/serializzazione che in fase di ricostruzione.

> Attenzione alle funzioni contenute all'interno della struttura dati; tutto ciò che viene esportato/ricaricato non dovrebbe avere logica applicativa.. bensì la logica applicativa dovrebbe essere rigenerata a partire dalle informazioni contenute nella sessione..


