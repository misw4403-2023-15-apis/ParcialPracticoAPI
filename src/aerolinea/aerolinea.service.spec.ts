/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.word.adjective(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.date.anytime(),
        paginaWeb: faker.internet.url(),        
      });
      aerolineasList.push(aerolinea);
    }
  };
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const aerolinea: AerolineaEntity[] = await service.findAll();
    expect(aerolinea).not.toBeNull();
    expect(aerolinea).toHaveLength(aerolineasList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(storedAerolinea.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb)
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encuentra una aerolinea con este Id")
  });

  it('create should return a new airline', async () => {
    const aerolinea: AerolineaEntity = {
      id:"",
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.date.anytime(),
      paginaWeb: faker.internet.url(),
      aeropuertos: []  
    }
 
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();
 
    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fechaFundacion).toEqual(newAerolinea.fechaFundacion)
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb)
  });

  it('update should modify a airline', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.nombre = "Nuevo nombre";
    aerolinea.descripcion = "Nueva descripcion";
     const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
     const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
  });

  it('update should throw an exception for an invalid airline', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "No se encuentra una aerolinea con este Id")
  });

  it('delete should remove a airline', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
     const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encuentra una aerolinea con este Id")
  });


});


