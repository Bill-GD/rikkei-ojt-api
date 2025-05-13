create table if not exists user (
  id         int primary key auto_increment,
  first_name varchar(100) not null,
  last_name  varchar(100) not null,
  email      varchar(255) not null,
  password   varchar(255) not null,
  avatar     varchar(255),
  phone      varchar(11),
  address    varchar(255),
  created_at datetime                   default current_timestamp,
  updated_at datetime                   default null,
  status     enum ('ACTIVE', 'BLOCKED') default 'ACTIVE'
);

create table if not exists role (
  id        int primary key auto_increment,
  role_name enum ('ROLE_ADMIN', 'ROLE_USER')
);

create table if not exists user_role (
  user_id int not null,
  role_id int not null,
  primary key (user_id, role_id),
  foreign key (user_id) references user (id) on delete cascade,
  foreign key (role_id) references role (id) on delete cascade
);

create table if not exists theater (
  id         int primary key auto_increment,
  name       varchar(100) not null,
  location   varchar(255) not null,
  phone      varchar(11),
  created_at datetime default current_timestamp,
  updated_at datetime default null
);

create table if not exists screen (
  id            int primary key auto_increment,
  name          varchar(100) not null,
  seat_capacity int,
  theater_id    int          not null,
  created_at    datetime default current_timestamp,
  updated_at    datetime default null,
  constraint positive_seat_capacity check (seat_capacity >= 0),
  foreign key (theater_id) references theater (id) on delete cascade

);

create table if not exists genre (
  id         int primary key auto_increment,
  genre_name varchar(255) not null
);

create table if not exists movie (
  id           int primary key auto_increment,
  title        varchar(255) not null,
  descriptions text,
  author       varchar(100),
  image        varchar(255),
  trailer      varchar(255),
  type         enum ('2D', '3D'),
  duration_min int,
  release_date datetime,
  created_at   datetime default current_timestamp,
  updated_at   datetime default null,
  constraint prositive_duration check (duration_min > 0)
);

create table if not exists movie_genre (
  movie_id int not null,
  genre_id int not null,
  primary key (movie_id, genre_id),
  foreign key (movie_id) references movie (id) on delete cascade,
  foreign key (genre_id) references genre (id) on delete cascade
);

create table if not exists showtime (
  id         int primary key auto_increment,
  screen_id  int not null,
  movie_id   int not null,
  start_time datetime,
  end_time   datetime,
  created_at datetime default current_timestamp,
  updated_at datetime default null,
  foreign key (movie_id) references movie (id) on delete cascade,
  foreign key (screen_id) references screen (id) on delete cascade,
  # constraint future_start_time check ( timestampdiff(second, start_time, current_timestamp) >= 0 ),
  constraint positive_duration check ( end_time > start_time )
);

create table if not exists booking (
  id                int primary key auto_increment,
  user_id           int not null,
  showtime_id       int not null,
  total_seat        int,
  total_price_movie double,
  created_at        datetime default current_timestamp,
  updated_at        datetime default null,
  foreign key (user_id) references user (id) on delete cascade,
  foreign key (showtime_id) references showtime (id) on delete cascade,
  constraint positive_seat check ( total_seat >= 0 ),
  constraint positive_price check ( total_price_movie >= 0 )
);

create table if not exists seat (
  id          int primary key auto_increment,
  screen_id   int         not null,
  seat_number varchar(50) not null,
  is_booked   bit(1)   default false,
  type        enum ('STANDARD', 'VIP', 'SWEETBOX'),
  created_at  datetime default current_timestamp,
  updated_at  datetime default null,
  foreign key (screen_id) references screen (id) on delete cascade
);

create table if not exists seat_booking (
  id         int primary key auto_increment,
  booking_id int not null,
  seat_id    int not null,
  quantity   int,
  created_at datetime default current_timestamp,
  updated_at datetime default null,
  foreign key (booking_id) references booking (id) on delete cascade,
  foreign key (seat_id) references seat (id) on delete cascade,
  constraint positive_quantity check ( quantity >= 0 )
);

create table if not exists banner (
  id       int primary key auto_increment,
  url      varchar(255) not null,
  type     enum ('IMAGE', 'VIDEO'),
  position varchar(255) not null
);

create table if not exists festival (
  id         int primary key auto_increment,
  title      varchar(255) not null,
  image      varchar(255),
  start_time datetime,
  end_time   datetime,
  # constraint future_start_time check ( timestampdiff(second, start_time, current_timestamp) >= 0 ),
  constraint positive_festival_duration check ( end_time > start_time )
);

create table if not exists news (
  id          int primary key auto_increment,
  title       varchar(255) not null,
  content     longtext,
  festival_id int          not null,
  created_at  datetime default current_timestamp,
  updated_at  datetime default null,
  foreign key (festival_id) references festival (id) on delete cascade
);

create table if not exists ticket_price (
  id         int primary key auto_increment,
  type_seat  enum ('STANDARD', 'VIP', 'SWEETBOX'),
  type_movie enum ('2D', '3D'),
  price      double,
  day_type   bit(1), # false - (ngày thường thứ 2 -> 5), true - (ngày đặc biệt thứ 6,7,CN, ngày lễ)
  start_time time,
  end_time   time,
  constraint positive_ticket_price check ( price >= 0 )
);

create table if not exists payment (
  id             int primary key auto_increment,
  booking_id     int not null,
  payment_method enum ('VIETQR', 'VNPAY', 'VIETTEL_PAY', 'PAYPAL'),
  payment_status enum ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'),
  payment_time   datetime,
  amount         double,
  transaction_id varchar(255),
  foreign key (booking_id) references booking (id) on delete cascade
);

create trigger check_showtime_start_time_insert
  before insert
  on showtime
  for each row
begin
  if new.start_time < current_timestamp then
    signal sqlstate '45000' set message_text = 'start_time cannot be in the past';
  end if;
end;

create trigger check_showtime_start_time_update
  before update
  on showtime
  for each row
begin
  if new.start_time < current_timestamp then
    signal sqlstate '45000' set message_text = 'start_time cannot be in the past';
  end if;
end;

create trigger check_festival_start_time_insert
  before insert
  on festival
  for each row
begin
  if new.start_time < current_timestamp then
    signal sqlstate '45000' set message_text = 'start_time cannot be in the past';
  end if;
end;

create trigger check_festival_start_time_update
  before update
  on festival
  for each row
begin
  if new.start_time < current_timestamp then
    signal sqlstate '45000' set message_text = 'start_time cannot be in the past';
  end if;
end;
