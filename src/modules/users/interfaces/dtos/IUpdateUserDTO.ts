export default interface IUpdateUserDTO {
  id: string;
  name?: string | undefined;
  password?: string | undefined;
  passwordConfirmation?: string | undefined;
  avatar?: string | undefined;
}
