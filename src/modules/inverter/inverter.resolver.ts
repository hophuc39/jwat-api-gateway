import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { type ClientGrpc } from '@nestjs/microservices';
import { InverterModel } from './dto/inverter.model';
import { InverterServiceClient } from 'proto/inverter';
import { firstValueFrom } from 'rxjs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { InverterList } from './dto/list-inverter.model';
import { FindAllInvertersInput } from './dto/find-all-inverters.input';
import { CreateInverterInput } from './dto/create-inverter.input';
import toDate from './date.helper';
import { UpdateInverterInput } from './dto/update-inverter.input';
import { GraphQLError } from 'graphql';

export class InverterResolver implements OnModuleInit {
  private inverterService: InverterServiceClient;

  constructor(
    @Inject('INVERTER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.inverterService =
      this.client.getService<InverterServiceClient>('InverterService');
  }

  @Mutation(() => InverterModel)
  @UseGuards(GqlAuthGuard)
  async createInverter(
    @Args('input', { type: () => CreateInverterInput })
    input: CreateInverterInput,
  ) {
    const {
      inverterCode,
      inverterName,
      slaveAddress,
      startAddress,
      useFlag,
      numberOfPoles,
    } = input;

    const data = await firstValueFrom(
      this.inverterService.createInverter({
        inverterCode,
        inverterName,
        slaveAddress,
        startAddress,
        useFlag,
        numberOfPoles,
      }),
    );

    const { item: inverter } = data;

    if (!inverter) {
      throw new InternalServerErrorException('Failed to create inverter');
    }

    return { ...inverter, updatedDate: toDate(inverter.updatedDate as any) };
  }

  @Mutation(() => InverterModel)
  @UseGuards(GqlAuthGuard)
  async updateInverter(
    @Args('input', { type: () => UpdateInverterInput })
    input: UpdateInverterInput,
  ) {
    const {
      id,
      inverterName,
      slaveAddress,
      startAddress,
      numberOfPoles,
      useFlag,
    } = input;

    const data = await firstValueFrom(
      this.inverterService.updateInverter({
        id,
        inverterName,
        slaveAddress,
        startAddress,
        numberOfPoles,
        useFlag,
      }),
    );

    const { item: inverter } = data;

    if (!inverter) {
      throw new GraphQLError('Failed to update inverter', {
        extensions: {
          status: 500,
        },
      });
    }

    return { ...inverter, updatedDate: toDate(inverter.updatedDate as any) };
  }

  @Query(() => InverterList)
  @UseGuards(GqlAuthGuard)
  async findAllInverters(
    @Args('filter', { type: () => FindAllInvertersInput })
    filter: FindAllInvertersInput,
  ) {
    const { page, pageSize, inverterCode, inverterName, useFlag } = filter;

    const data = await firstValueFrom(
      this.inverterService.findAllInverters({
        page,
        pageSize,
        inverterCode,
        inverterName,
        useFlag,
      }),
    );

    const { items, pagination } = data;

    return {
      items: (items ?? []).map((inv) => ({
        ...inv,
        updatedDate: toDate(inv.updatedDate as any),
      })),
      pagination: pagination ?? {
        total: 0,
        page: page ?? 1,
        pageSize: pageSize ?? 10,
      },
    };
  }

  @Query(() => InverterModel, { nullable: true })
  async findInverterById(@Args('id') id: string) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      throw new BadRequestException('ID must be a valid UUID');
    }
    try {
      const data = await firstValueFrom(
        this.inverterService.findInverterById({ id }),
      );

      const { item: inverter } = data;

      if (!inverter) {
        throw new NotFoundException(`Inverter with ID ${id} not found`);
      }

      return { ...inverter, updatedDate: toDate(inverter.updatedDate as any) };
    } catch (error) {
      if (error.code === 5) {
        throw new NotFoundException(`Inverter with ID ${id} not found`);
      }

      throw error;
    }
  }
}
