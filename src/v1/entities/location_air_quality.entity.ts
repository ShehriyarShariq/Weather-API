import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm'
import { Point } from 'geojson'

@Entity({ name: 'location_air_quality' })
export class LocationAirQuality {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  city: string

  @Column()
  country: string

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point

  @Column({ type: 'timestamptz' })
  ts: Date

  @Column()
  aqius: number

  @Column()
  mainus: string

  @Column()
  aqicn: number

  @Column()
  maincn: string

  toJSON() {
    return {
      ts: this.ts.toUTCString(),
      aqius: this.aqius,
      mainus: this.mainus,
      aqicn: this.aqicn,
      maincn: this.maincn,
    }
  }
}
