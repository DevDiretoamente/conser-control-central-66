import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { validateCPF, formatCPF } from '@/utils/validators';
import DocumentUploader from './DocumentUploader';
import MultiDocumentUploader from './MultiDocumentUploader';
import DependentesTab from './DependentesTab';
import FuncaoTab from './FuncaoTab';
import UniformeTab from './UniformeTab';
import { Funcionario } from '@/types/funcionario';
import VerticalTabs from './VerticalTabs';

// Custom validator for CPF
const cpfValidator = z.string().refine(validateCPF, {
  message: 'CPF inválido'
});

// Schemas for the form
const dadosPessoaisSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  cpf: cpfValidator,
  rg: z.string().min(1, { message: 'RG é obrigatório' }),
  dataNascimento: z.date({ required_error: 'Data de nascimento é obrigatória' }),
  escolaridade: z.string().min(1, { message: 'Escolaridade é obrigatória' }),
  estadoCivil: z.string().min(1, { message: 'Estado civil é obrigatório' }),
  nomeConjuge: z.string().optional(),
  telefoneConjuge: z.string().optional(),
  contatoEmergenciaNome: z.string().min(1, { message: 'Contato de emergência é obrigatório' }),
  contatoEmergenciaTelefone: z.string().min(1, { message: 'Telefone de emergência é obrigatório' }),
});

const enderecoSchema = z.object({
  cep: z.string().min(8, { message: 'CEP inválido' }),
  rua: z.string().min(1, { message: 'Rua é obrigatória' }),
  numero: z.string().min(1, { message: 'Número é obrigatório' }),
  complemento: z.string().optional(),
  bairro: z.string().min(1, { message: 'Bairro é obrigatório' }),
  cidade: z.string().min(1, { message: 'Cidade é obrigatória' }),
  uf: z.string().min(2, { message: 'UF é obrigatória' }).max(2),
});

const contatoSchema = z.object({
  telefone: z.string().min(10, { message: 'Telefone inválido' }),
  email: z.string().email({ message: 'E-mail inválido' }).optional(),
});

const dadosProfissionaisSchema = z.object({
  funcaoId: z.string().optional(),
  cargo: z.string().min(1, { message: 'Cargo é obrigatório' }),
  salario: z.number().min(0, { message: 'Salário deve ser maior que zero' }),
  dataAdmissao: z.date({ required_error: 'Data de admissão é obrigatória' }),
  ctpsNumero: z.string().min(1, { message: 'Número da CTPS é obrigatório' }),
  ctpsSerie: z.string().min(1, { message: 'Série da CTPS é obrigatória' }),
  pis: z.string().min(1, { message: 'PIS é obrigatório' }),
  tituloEleitor: z.string().optional(),
  certificadoReservista: z.string().optional(),
});

const cnhSchema = z.object({
  numero: z.string().optional(),
  categoria: z.string().optional(),
  validade: z.date().optional(),
});

const dadosBancariosSchema = z.object({
  banco: z.string().min(1, { message: 'Banco é obrigatório' }),
  agencia: z.string().min(1, { message: 'Agência é obrigatória' }),
  conta: z.string().min(1, { message: 'Conta é obrigatória' }),
  tipoConta: z.enum(['corrente', 'poupanca']),
});

const documentosSchema = z.object({
  rgFile: z.any().optional(),
  cpfFile: z.any().optional(),
  comprovanteResidencia: z.any().optional(),
  fotoFile: z.any().optional(),
  cnhFile: z.any().optional(),
  ctpsFile: z.any().optional(),
  exameMedicoFile: z.any().optional(),
  outrosDocumentos: z.array(z.any()).optional(),
});

const tamanhoUniformeSchema = z.object({
  camisa: z.string().optional(),
  calca: z.string().optional(),
  calcado: z.number().optional(),
});

const funcionarioSchema = z.object({
  dadosPessoais: dadosPessoaisSchema,
  endereco: enderecoSchema,
  contato: contatoSchema,
  dadosProfissionais: dadosProfissionaisSchema,
  cnh: cnhSchema,
  dadosBancarios: dadosBancariosSchema,
  documentos: documentosSchema,
  dependentes: z.array(
    z.object({
      nome: z.string().min(1, { message: 'Nome é obrigatório' }),
      dataNascimento: z.date({ required_error: 'Data de nascimento é obrigatória' }),
      parentesco: z.string().min(1, { message: 'Parentesco é obrigatório' }),
      cpf: z.string().optional(),
      documentos: z.object({
        certidaoNascimento: z.any().optional(),
        outrosDocumentos: z.array(z.any()).optional(),
      }),
    })
  ).optional(),
  tamanhoUniforme: tamanhoUniformeSchema,
  episEntregues: z.array(z.any()).optional(),
  uniformesEntregues: z.array(z.any()).optional(),
  examesRealizados: z.array(z.any()).optional(),
});

type FuncionarioFormValues = z.infer<typeof funcionarioSchema>;

interface FuncionarioFormProps {
  funcionarioId?: string;
  defaultValues?: Partial<Funcionario>;
  onSuccess?: (data: any) => void;
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  funcionarioId,
  defaultValues,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const isEditMode = !!funcionarioId;
  const [documentFiles, setDocumentFiles] = useState({
    rgFile: null as File | null,
    cpfFile: null as File | null,
    comprovanteResidencia: null as File | null,
    fotoFile: null as File | null,
    cnhFile: null as File | null,
    ctpsFile: null as File | null,
    exameMedicoFile: null as File | null,
    outrosDocumentos: [] as File[],
  });

  const form = useForm<Funcionario>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: defaultValues || {
      dadosPessoais: {
        nome: '',
        cpf: '',
        rg: '',
        dataNascimento: undefined,
        escolaridade: '',
        estadoCivil: '',
        nomeConjuge: '',
        telefoneConjuge: '',
        contatoEmergenciaNome: '',
        contatoEmergenciaTelefone: '',
      },
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
      },
      contato: {
        telefone: '',
        email: '',
      },
      dadosProfissionais: {
        funcaoId: '',
        cargo: '',
        salario: 0,
        dataAdmissao: undefined,
        ctpsNumero: '',
        ctpsSerie: '',
        pis: '',
        tituloEleitor: '',
        certificadoReservista: '',
      },
      cnh: {
        numero: '',
        categoria: '',
        validade: undefined,
      },
      dadosBancarios: {
        banco: '',
        agencia: '',
        conta: '',
        tipoConta: 'corrente',
      },
      documentos: {
        rgFile: null,
        cpfFile: null,
        comprovanteResidencia: null,
        fotoFile: null,
        cnhFile: null,
        ctpsFile: null,
        exameMedicoFile: null,
        outrosDocumentos: [],
      },
      dependentes: [],
      tamanhoUniforme: {
        camisa: '',
        calca: '',
        calcado: undefined,
      },
      episEntregues: [],
      uniformesEntregues: [],
      examesRealizados: [],
    },
  });

  const handleDocumentChange = (documentKey: keyof typeof documentFiles, file: File | null) => {
    setDocumentFiles(prev => ({
      ...prev,
      [documentKey]: file
    }));
    
    form.setValue(`documentos.${documentKey}` as any, file);
  };

  const handleMultiDocumentChange = (files: File[]) => {
    setDocumentFiles(prev => ({
      ...prev,
      outrosDocumentos: files
    }));
    
    form.setValue('documentos.outrosDocumentos', files as any);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedCpf = formatCPF(value);
    form.setValue('dadosPessoais.cpf', formattedCpf, { shouldValidate: true });
  };

  const buscarCep = async (cep: string) => {
    if (cep.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      form.setValue('endereco.rua', data.logradouro);
      form.setValue('endereco.bairro', data.bairro);
      form.setValue('endereco.cidade', data.localidade);
      form.setValue('endereco.uf', data.uf);
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const markSectionCompleted = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections(prev => [...prev, section]);
    }
  };

  const navigateToNextTab = () => {
    const tabs = ["dados-pessoais", "endereco", "contato", "funcao", "dados-profissionais", "cnh", 
                 "dados-bancarios", "uniformes", "documentos", "dependentes"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      markSectionCompleted(activeTab);
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const navigateToPreviousTab = () => {
    const tabs = ["dados-pessoais", "endereco", "contato", "funcao", "dados-profissionais", "cnh", 
                 "dados-bancarios", "uniformes", "documentos", "dependentes"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const onSubmit = async (data: Funcionario) => {
    try {
      setIsLoading(true);
      
      // Add document files to data
      data.documentos = documentFiles as any;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(
        isEditMode 
          ? 'Funcionário atualizado com sucesso!' 
          : 'Funcionário cadastrado com sucesso!'
      );
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      toast.error('Erro ao salvar funcionário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with vertical tabs */}
          <div className="w-full lg:w-1/4 bg-card p-4 rounded-lg border shadow-sm">
            <VerticalTabs 
              defaultValue={activeTab} 
              onChange={handleTabChange} 
              completedSections={completedSections}
            />
          </div>

          {/* Content area */}
          <div className="w-full lg:w-3/4">
            {/* Dados Pessoais */}
            {activeTab === "dados-pessoais" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dadosPessoais.nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF*</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="000.000.000-00" 
                              value={field.value}
                              onChange={(e) => handleCpfChange(e)}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.rg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RG*</FormLabel>
                          <FormControl>
                            <Input placeholder="RG" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.dataNascimento"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Nascimento*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.escolaridade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escolaridade*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fundamental_incompleto">Fundamental Incompleto</SelectItem>
                              <SelectItem value="fundamental_completo">Fundamental Completo</SelectItem>
                              <SelectItem value="medio_incompleto">Médio Incompleto</SelectItem>
                              <SelectItem value="medio_completo">Médio Completo</SelectItem>
                              <SelectItem value="superior_incompleto">Superior Incompleto</SelectItem>
                              <SelectItem value="superior_completo">Superior Completo</SelectItem>
                              <SelectItem value="pos_graduacao">Pós-graduação</SelectItem>
                              <SelectItem value="mestrado">Mestrado</SelectItem>
                              <SelectItem value="doutorado">Doutorado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.estadoCivil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Civil*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                              <SelectItem value="casado">Casado(a)</SelectItem>
                              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                              <SelectItem value="uniao_estavel">União Estável</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.nomeConjuge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Cônjuge</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do cônjuge" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.telefoneConjuge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone do Cônjuge</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.contatoEmergenciaNome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Contato de Emergência*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do contato" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosPessoais.contatoEmergenciaTelefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone de Emergência*</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Endereço */}
            {activeTab === "endereco" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="endereco.cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP*</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="00000-000" 
                              {...field} 
                              onBlur={(e) => {
                                field.onBlur();
                                buscarCep(e.target.value.replace(/\D/g, ''));
                              }}
                            />
                          </FormControl>
                          <FormDescription>Digite o CEP para preencher automaticamente</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endereco.rua"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua*</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endereco.numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número*</FormLabel>
                          <FormControl>
                            <Input placeholder="Número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endereco.complemento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endereco.bairro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro*</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endereco.cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade*</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endereco.uf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UF*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="UF" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((uf) => (
                                <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Contato */}
            {activeTab === "contato" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contato.telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone*</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contato.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Função */}
            {activeTab === "funcao" && (
              <Card>
                <CardContent className="pt-6">
                  <FuncaoTab form={form} />
                </CardContent>
              </Card>
            )}
            
            {/* Dados Profissionais */}
            {activeTab === "dados-profissionais" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.funcaoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Função</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Selecione uma função</SelectItem>
                              {/* Add options for functions */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="operador">Operador</SelectItem>
                              <SelectItem value="motorista">Motorista</SelectItem>
                              <SelectItem value="auxiliar_administrativo">Auxiliar Administrativo</SelectItem>
                              <SelectItem value="engenheiro">Engenheiro</SelectItem>
                              <SelectItem value="gerente">Gerente</SelectItem>
                              <SelectItem value="diretor">Diretor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.salario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salário*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0,00" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.dataAdmissao"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Admissão*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.ctpsNumero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número da CTPS*</FormLabel>
                          <FormControl>
                            <Input placeholder="Número da CTPS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.ctpsSerie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Série da CTPS*</FormLabel>
                          <FormControl>
                            <Input placeholder="Série da CTPS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.pis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIS*</FormLabel>
                          <FormControl>
                            <Input placeholder="PIS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.tituloEleitor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título de Eleitor</FormLabel>
                          <FormControl>
                            <Input placeholder="Título de Eleitor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosProfissionais.certificadoReservista"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificado de Reservista</FormLabel>
                          <FormControl>
                            <Input placeholder="Certificado de Reservista" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* CNH */}
            {activeTab === "cnh" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cnh.numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número da CNH</FormLabel>
                          <FormControl>
                            <Input placeholder="Número da CNH" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cnh.categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Não possui</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="E">E</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cnh.validade"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Validade</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Dados Bancários */}
            {activeTab === "dados-bancarios" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dadosBancarios.banco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco*</FormLabel>
                          <FormControl>
                            <Input placeholder="Banco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosBancarios.agencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agência*</FormLabel>
                          <FormControl>
                            <Input placeholder="Agência" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosBancarios.conta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conta*</FormLabel>
                          <FormControl>
                            <Input placeholder="Conta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dadosBancarios.tipoConta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Conta*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="corrente">Conta Corrente</SelectItem>
                              <SelectItem value="poupanca">Conta Poupança</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Uniformes */}
            {activeTab === "uniformes" && (
              <Card>
                <CardContent className="pt-6">
                  <UniformeTab form={form} />
                </CardContent>
              </Card>
            )}
            
            {/* Documentos */}
            {activeTab === "documentos" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentUploader 
                      label="RG" 
                      onFileChange={(file) => handleDocumentChange('rgFile', file)}
                      value={documentFiles.rgFile}
                    />
                    
                    <DocumentUploader 
                      label="CPF" 
                      onFileChange={(file) => handleDocumentChange('cpfFile', file)}
                      value={documentFiles.cpfFile}
                    />
                    
                    <DocumentUploader 
                      label="Comprovante de Residência" 
                      onFileChange={(file) => handleDocumentChange('comprovanteResidencia', file)}
                      value={documentFiles.comprovanteResidencia}
                    />
                    
                    <DocumentUploader 
                      label="Foto" 
                      onFileChange={(file) => handleDocumentChange('fotoFile', file)}
                      value={documentFiles.fotoFile}
                    />
                    
                    <DocumentUploader 
                      label="CTPS" 
                      onFileChange={(file) => handleDocumentChange('ctpsFile', file)}
                      value={documentFiles.ctpsFile}
                    />
                    
                    <DocumentUploader 
                      label="CNH" 
                      onFileChange={(file) => handleDocumentChange('cnhFile', file)}
                      value={documentFiles.cnhFile}
                    />
                    
                    <DocumentUploader 
                      label="Exame Médico" 
                      onFileChange={(file) => handleDocumentChange('exameMedicoFile', file)}
                      value={documentFiles.exameMedicoFile}
                    />
                    
                    <MultiDocumentUploader 
                      onFilesChange={handleMultiDocumentChange}
                      value={documentFiles.outrosDocumentos}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Dependentes */}
            {activeTab === "dependentes" && (
              <Card>
                <CardContent className="pt-6">
                  <DependentesTab form={form} />
                </CardContent>
              </Card>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={navigateToPreviousTab}
                disabled={activeTab === "dados-pessoais"}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              
              <div className="space-x-2">
                {activeTab === "dependentes" ? (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">⌛</span>
                        Salvando...
                      </div>
                    ) : (
                      <>
                        <CircleCheck className="mr-2 h-4 w-4" />
                        Salvar Funcionário
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={navigateToNextTab}
                    variant="default"
                  >
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FuncionarioForm;
