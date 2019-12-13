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